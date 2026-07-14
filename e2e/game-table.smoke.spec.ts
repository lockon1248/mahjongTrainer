import { test, expect, type Page } from '@playwright/test'

test.describe('牌桌 smoke e2e', () => {
  const waitForBridge = async (page: Page) => {
    await page.waitForFunction(() => {
      const bridge = (window as Window & {
        __MAHJONG_E2E__?: {
          seedPonClaimScenario: () => void
          seedDiscardWinScenario: () => void
          seedBigThreeDragonsClaimScenario: () => void
          seedDrawNextRoundScenario: () => void
        }
      }).__MAHJONG_E2E__

      return typeof bridge?.seedPonClaimScenario === 'function'
        && typeof bridge?.seedDiscardWinScenario === 'function'
        && typeof bridge?.seedBigThreeDragonsClaimScenario === 'function'
        && typeof bridge?.seedDrawNextRoundScenario === 'function'
    })
  }

  test('首頁可以進入牌局頁並看到本機對局', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: '台灣 16 張麻將' })).toBeVisible()
    await page.getByRole('link', { name: '開始牌局' }).click()

    await expect(page).toHaveURL(/\/game$/)
    await expect(page.getByRole('heading', { name: '麻將牌局' })).toBeVisible()
    await expect(page.getByTestId('summary-dealer')).toContainText('東家')
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
    await expect(page.getByTestId('result-total-tai')).toContainText('1')
    await expect(page.getByTestId('result-scoring-items')).toContainText('莊家胡')
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
    await expect(page.getByTestId('result-total-tai')).toContainText('9')
    await expect(page.getByTestId('result-scoring-items')).toContainText('大三元')
    await expect(page.getByTestId('result-scoring-items')).toContainText('莊家胡')
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
    await expect(page.getByTestId('human-discard-tile')).toHaveCount(17)
  })
})
