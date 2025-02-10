import { test} from '@playwright/test';
import { setup_ide } from './ide_setup';
import { replaceNodeText, assertTextHasBeenReplaced, terminateProcessOnPort } from '../resources/methods';

const ide = process.env.IDE?.toLowerCase() ?? 'eclipse';
test.afterEach(async () => {
  await terminateProcessOnPort(ide);
});

test('Renaming node example with DOM manipulation', async ({ page }) => {
  test.setTimeout(300000); // 30 seconds timeout
  console.log("Currently running the tests on", ide);
  let testPage: any = await setup_ide(ide, page);

// classForTestingPurposes is defined as a CSS class in test-workflow/example1.wf line 80
  const nodeClass = 'g.node.task.manual.classForTestingPurposes'

  await replaceNodeText(testPage, nodeClass, "Hello");
  await assertTextHasBeenReplaced(testPage, nodeClass, "Hello");
  await replaceNodeText(testPage, nodeClass, "Push");
  await assertTextHasBeenReplaced(testPage, nodeClass, "Push");

  await page.close();
});


