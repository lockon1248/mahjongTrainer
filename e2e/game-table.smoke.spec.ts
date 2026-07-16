import { test, expect, type Page } from '@playwright/test'

test.describe('牌桌 smoke e2e', () => {
  test.setTimeout(90_000)

  const waitForBridge = async (page: Page) => {
    await page.waitForFunction(() => {
      const bridge = (window as Window & {
        __MAHJONG_E2E__?: {
          seedPonClaimScenario: () => void
          seedDiscardWinScenario: () => void
          seedBigThreeDragonsClaimScenario: () => void
          seedDrawNextRoundScenario: () => void
          seedClassicFlowerProfileWinScenario: () => void
          seedBonusFlowerProfileWinScenario: () => void
          seedDealerRotationNextRoundScenario: () => void
          seedAiWinRevealScenario: () => void
        }
      }).__MAHJONG_E2E__

      return typeof bridge?.seedPonClaimScenario === 'function'
        && typeof bridge?.seedDiscardWinScenario === 'function'
        && typeof bridge?.seedBigThreeDragonsClaimScenario === 'function'
        && typeof bridge?.seedDrawNextRoundScenario === 'function'
        && typeof bridge?.seedClassicFlowerProfileWinScenario === 'function'
        && typeof bridge?.seedBonusFlowerProfileWinScenario === 'function'
        && typeof bridge?.seedDealerRotationNextRoundScenario === 'function'
        && typeof bridge?.seedAiWinRevealScenario === 'function'
    })
  }

  test('首頁可以進入牌局頁並看到本機對局', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: '台灣 16 張麻將' })).toBeVisible()
    await page.getByRole('link', { name: '開始牌局' }).click()

    await expect(page).toHaveURL(/\/game$/)
    await expect(page.getByRole('heading', { name: '麻將牌局' })).toBeVisible()
    await expect(page.getByTestId('summary-dealer')).toContainText('東家')
    await expect(page.getByTestId('player-dealer-east')).toContainText('莊家')
    await expect(page.getByTestId('game-table-view')).not.toContainText('聽牌')
  })

  test('真人可以從 fresh round 出牌並看到中央牌池更新', async ({ page }) => {
    await page.goto('/game')

    await expect(page.getByRole('heading', { name: '麻將牌局' })).toBeVisible()
    await expect(page.getByTestId('human-discard-tile')).toHaveCount(17)

    await page.getByTestId('human-discard-tile').first().click()

    await expect(page.getByTestId('discard-tile-east-0')).toBeVisible()
    await expect(page.getByTestId('discard-pool-east')).toContainText('1 張')
    await expect(page.getByTestId('summary-total-discards')).not.toContainText('0')
    await expect(page.getByTestId('summary-last-claim')).toBeVisible()
  })

  test('AI 不會在真人出牌後瞬間跳步，而是保留可讀的延遲節奏', async ({ page }) => {
    await page.goto('/game')

    await expect(page.getByRole('heading', { name: '麻將牌局' })).toBeVisible()
    await page.getByTestId('human-discard-tile').first().click()

    await expect(page.getByTestId('summary-current-seat')).toContainText('東家')

    await page.waitForTimeout(600)
    await expect(page.getByTestId('summary-current-seat')).toContainText('東家')

    await expect.poll(async () => {
      return page.getByTestId('summary-current-seat').textContent()
    }, {
      timeout: 3000
    }).not.toContain('東家')
  })

  test('真人出牌後 AI 會持續接續推進，不會停在下家卡死', async ({ page }) => {
    await page.goto('/game')

    await expect(page.getByRole('heading', { name: '麻將牌局' })).toBeVisible()
    await page.getByTestId('human-discard-tile').first().click()

    await expect(page.getByTestId('summary-total-discards')).toContainText('1')

    await expect.poll(async () => {
      const text = await page.getByTestId('summary-total-discards').textContent()
      return Number((text ?? '').replace('總捨牌數', '').trim())
    }, {
      timeout: 9000
    }).toBeGreaterThan(1)
  })

  test('人類宣告碰牌後，副露、暗手與中央捨牌池會同步更新', async ({ page }) => {
    await page.goto('/game?e2e=1')
    await waitForBridge(page)

    await page.evaluate(() => {
      ;(window as Window & { __MAHJONG_E2E__: { seedPonClaimScenario: () => void } }).__MAHJONG_E2E__.seedPonClaimScenario()
    })

    await expect(page.getByTestId('human-claim-actions')).toBeVisible()
    await page.getByTestId('human-claim-action').filter({ hasText: '碰牌' }).click()

    await expect(page.getByTestId('player-melds-east')).toContainText('碰')
    await expect(page.getByTestId('player-melds-east')).toContainText('西風')
    await expect(page.getByTestId('discard-pool-north')).not.toContainText('西風')
    await expect(page.getByTestId('human-discard-tile')).toHaveCount(14)
  })

  test('人類榮和後，結果摘要會顯示台型明細與總台數', async ({ page }) => {
    await page.goto('/game?e2e=1')
    await waitForBridge(page)

    await page.evaluate(() => {
      ;(window as Window & { __MAHJONG_E2E__: { seedDiscardWinScenario: () => void } }).__MAHJONG_E2E__.seedDiscardWinScenario()
    })

    await expect(page.getByTestId('human-claim-actions')).toBeVisible()
    await page.getByTestId('human-claim-action').filter({ hasText: '和牌' }).click()

    await expect(page.getByTestId('round-result-summary')).toBeVisible()
    await expect(page.getByTestId('result-type')).toContainText('和牌')
    await expect(page.getByTestId('result-total-tai')).toContainText('2')
    await expect(page.getByTestId('result-scoring-items')).toContainText('莊家 1 台')
    await expect(page.getByTestId('result-scoring-items')).toContainText('門清 1 台')
  })

  test('特殊胡型場景會在瀏覽器中顯示大三元台數', async ({ page }) => {
    await page.goto('/game?e2e=1')
    await waitForBridge(page)

    await page.evaluate(() => {
      ;(window as Window & { __MAHJONG_E2E__: { seedBigThreeDragonsClaimScenario: () => void } }).__MAHJONG_E2E__.seedBigThreeDragonsClaimScenario()
    })

    await expect(page.getByTestId('human-claim-actions')).toBeVisible()
    await page.getByTestId('human-claim-action').filter({ hasText: '和牌' }).click()

    await expect(page.getByTestId('round-result-summary')).toBeVisible()
    await expect(page.getByTestId('result-total-tai')).toContainText('10')
    await expect(page.getByTestId('result-scoring-items')).toContainText('大三元')
    await expect(page.getByTestId('result-scoring-items')).toContainText('莊家 1 台')
    await expect(page.getByTestId('result-scoring-items')).toContainText('門清 1 台')
  })

  test('同一手牌在不同 scoring profile 下會顯示不同台型摘要', async ({ page }) => {
    await page.goto('/game?e2e=1')
    await waitForBridge(page)

    await page.evaluate(() => {
      ;(window as Window & {
        __MAHJONG_E2E__: { seedClassicFlowerProfileWinScenario: () => void }
      }).__MAHJONG_E2E__.seedClassicFlowerProfileWinScenario()
    })

    await expect(page.getByTestId('human-claim-actions')).toBeVisible()
    await page.getByTestId('human-claim-action').filter({ hasText: '和牌' }).click()

    await expect(page.getByTestId('result-total-tai')).toContainText('4')
    await expect(page.getByTestId('result-scoring-items')).toContainText('莊家 1 台')
    await expect(page.getByTestId('result-scoring-items')).toContainText('門清 1 台')
    await expect(page.getByTestId('result-scoring-items')).toContainText('花牌 1 台')
    await expect(page.getByTestId('result-scoring-items')).not.toContainText('見風見台 1 台')

    await page.reload()
    await waitForBridge(page)

    await page.evaluate(() => {
      ;(window as Window & {
        __MAHJONG_E2E__: { seedBonusFlowerProfileWinScenario: () => void }
      }).__MAHJONG_E2E__.seedBonusFlowerProfileWinScenario()
    })

    await expect(page.getByTestId('human-claim-actions')).toBeVisible()
    await page.getByTestId('human-claim-action').filter({ hasText: '和牌' }).click()

    await expect(page.getByTestId('result-total-tai')).toContainText('5')
    await expect(page.getByTestId('result-scoring-items')).toContainText('莊家 1 台')
    await expect(page.getByTestId('result-scoring-items')).toContainText('門清 1 台')
    await expect(page.getByTestId('result-scoring-items')).toContainText('見花見台 1 台')
    await expect(page.getByTestId('result-scoring-items')).toContainText('見風見台 1 台')
    await expect(page.getByTestId('result-scoring-items')).not.toContainText('花牌 1 台')
  })

  test('流局結果畫面按下一局後會回到新局且不顯示錯誤', async ({ page }) => {
    await page.goto('/game?e2e=1')
    await waitForBridge(page)

    await page.evaluate(() => {
      ;(window as Window & { __MAHJONG_E2E__: { seedDrawNextRoundScenario: () => void } }).__MAHJONG_E2E__.seedDrawNextRoundScenario()
    })

    await expect(page.getByTestId('round-result-summary')).toBeVisible()
    await expect(page.getByTestId('result-type')).toContainText('流局')
    await expect(page.getByTestId('next-round-action')).toBeVisible()

    await page.getByTestId('next-round-action').click()

    await expect(page.getByTestId('game-error')).toHaveCount(0)
    await expect(page.getByTestId('round-result-summary')).toHaveCount(0)
    await expect(page.getByTestId('next-round-actions')).toHaveCount(0)
    await expect(page.getByTestId('summary-outcome')).toContainText('對局中')
    await expect(page.getByTestId('summary-dealer')).toContainText('東家')
    await expect(page.getByTestId('player-dealer-east')).toContainText('莊家')
    await expect(page.getByTestId('human-discard-tile')).toHaveCount(17)
  })

  test('非莊家和牌後開下一局會輪莊到下家，並且先停在新莊家的出牌回合', async ({ page }) => {
    await page.goto('/game?e2e=1')
    await waitForBridge(page)

    await page.evaluate(() => {
      ;(window as Window & {
        __MAHJONG_E2E__: { seedDealerRotationNextRoundScenario: () => void }
      }).__MAHJONG_E2E__.seedDealerRotationNextRoundScenario()
    })

    await expect(page.getByTestId('round-result-summary')).toBeVisible()
    await expect(page.getByTestId('summary-dealer')).toContainText('東家')

    await page.getByTestId('next-round-action').click()

    await expect(page.getByTestId('summary-dealer')).toContainText('西家')
    await expect(page.getByTestId('player-dealer-west')).toContainText('莊家')
    await expect(page.getByTestId('player-active-west')).toContainText('目前出牌')
    await expect(page.getByTestId('summary-current-seat')).toContainText('西家')
  })

  test('AI 和牌後會在得勝牌區亮出自己的和牌手牌', async ({ page }) => {
    await page.goto('/game?e2e=1')
    await waitForBridge(page)

    await page.evaluate(() => {
      ;(window as Window & {
        __MAHJONG_E2E__: { seedAiWinRevealScenario: () => void }
      }).__MAHJONG_E2E__.seedAiWinRevealScenario()
    })

    await expect(page.getByTestId('round-result-summary')).toBeVisible()
    await expect(page.getByTestId('player-winning-tiles-south')).toContainText('和牌手牌')
    await expect(page.getByTestId('player-winning-tiles-south')).toContainText('一萬')
    await expect(page.getByTestId('player-winning-tiles-south')).toContainText('四筒')
    await expect(page.getByTestId('player-winning-tiles-south')).toContainText('東風')
  })
})
