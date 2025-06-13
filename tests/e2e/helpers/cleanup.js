const { expect } = require("@playwright/test");
const SELECTORS = require("../constants/selectors");

async function cleanUpPlannerTasks({ page, context, baseUrl }) {
  try {
    if (page.isClosed?.()) return;

    await page.goto(`${baseUrl}/wp-admin/admin.php?page=progress-planner`);
    await page.waitForLoadState("networkidle");

    // Active tasks
    while (true) {
      const todos = page.locator(SELECTORS.TODO_ITEM);
      const count = await todos.count();
      if (count === 0) break;

      const firstItem = todos.first();
      const trash = firstItem.locator(".trash");

      try {
        await firstItem.hover();
        await trash.waitFor({ state: "visible", timeout: 3000 });
        await trash.click();

        // Wait until the count goes down
        await expect(todos).toHaveCount(count - 1, { timeout: 5000 });
      } catch (error) {
        console.warn(`[Cleanup] Failed to delete todo item: ${error.message}`);
        break;
      }
    }

    // Completed tasks
    const completedDetails = page.locator(
      "details#todo-list-completed-details"
    );

    if (await completedDetails.isVisible()) {
      await completedDetails.click();
      await page.waitForTimeout(500); // allow DOM to expand

      while (true) {
        const completedTodos = page.locator(SELECTORS.TODO_COMPLETED_ITEM);
        const count = await completedTodos.count();
        if (count === 0) break;

        const firstItem = completedTodos.first();
        const trash = firstItem.locator(".trash");

        try {
          await firstItem.hover();
          await trash.waitFor({ state: "visible", timeout: 3000 });
          await trash.click();

          await expect(completedTodos).toHaveCount(count - 1, {
            timeout: 5000,
          });
        } catch (error) {
          console.warn(
            `[Cleanup] Failed to delete completed item: ${error.message}`
          );
          break;
        }
      }
    }
  } catch (e) {
    console.warn("[Cleanup] Failed or skipped:", e.message);
  }

  try {
    await context.close();
  } catch {
    // context might already be closed
  }
}

module.exports = { cleanUpPlannerTasks };
