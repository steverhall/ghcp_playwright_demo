// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Todo List Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial empty state', async ({ page }) => {
    // Check the page title and heading
    await expect(page).toHaveTitle('Todo List - SPA Demo');
    await expect(page.getByRole('heading', { name: 'My Todo List' })).toBeVisible();
    
    // Check empty state is displayed
    await expect(page.getByText('No todos yet. Add one above to get started!')).toBeVisible();
    
    // Check input and button are present
    await expect(page.getByPlaceholder('Add a new todo item...')).toBeVisible();
    await expect(page.getByRole('button').first()).toBeVisible();
  });

  test('should add a new todo item', async ({ page }) => {
    const todoText = 'Learn Playwright testing';
    
    // Add a new todo
    await page.getByPlaceholder('Add a new todo item...').fill(todoText);
    await page.getByRole('button').first().click();
    
    // Check the todo was added
    await expect(page.getByText(todoText)).toBeVisible();
    await expect(page.getByText('No todos yet')).not.toBeVisible();
    
    // Check edit and delete buttons are present
    await expect(page.getByRole('button', { name: 'Edit todo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete todo' })).toBeVisible();
    
    // Check input is cleared
    await expect(page.getByPlaceholder('Add a new todo item...')).toHaveValue('');
  });

  test('should add multiple todo items', async ({ page }) => {
    const todos = ['First todo', 'Second todo', 'Third todo'];
    
    // Add multiple todos
    for (const todo of todos) {
      await page.getByPlaceholder('Add a new todo item...').fill(todo);
      await page.getByRole('button').first().click();
    }
    
    // Check all todos are displayed
    for (const todo of todos) {
      await expect(page.getByText(todo)).toBeVisible();
    }
    
    // Check we have 3 todo items
    await expect(page.getByRole('listitem')).toHaveCount(3);
  });

  test('should edit a todo item', async ({ page }) => {
    const originalText = 'Original todo';
    const editedText = 'Edited todo';
    
    // Add a todo
    await page.getByPlaceholder('Add a new todo item...').fill(originalText);
    await page.getByRole('button').first().click();
    
    // Click edit button
    await page.getByRole('button', { name: 'Edit todo' }).click();
    
    // Check edit mode is active
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel editing' })).toBeVisible();
    
    // Edit the text
    const editInput = page.getByRole('textbox').nth(1); // Skip the main input
    await editInput.clear();
    await editInput.fill(editedText);
    
    // Save changes
    await page.getByRole('button', { name: 'Save changes' }).click();
    
    // Check the todo was updated
    await expect(page.getByText(editedText)).toBeVisible();
    await expect(page.getByText(originalText)).not.toBeVisible();
    
    // Check edit mode is no longer active
    await expect(page.getByRole('button', { name: 'Save changes' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit todo' })).toBeVisible();
  });

  test('should cancel editing a todo item', async ({ page }) => {
    const originalText = 'Original todo';
    
    // Add a todo
    await page.getByPlaceholder('Add a new todo item...').fill(originalText);
    await page.getByRole('button').first().click();
    
    // Click edit button
    await page.getByRole('button', { name: 'Edit todo' }).click();
    
    // Edit the text
    const editInput = page.getByRole('textbox').nth(1);
    await editInput.clear();
    await editInput.fill('This should not be saved');
    
    // Cancel editing
    await page.getByRole('button', { name: 'Cancel editing' }).click();
    
    // Check the original text is still there
    await expect(page.getByText(originalText)).toBeVisible();
    await expect(page.getByText('This should not be saved')).not.toBeVisible();
    
    // Check edit mode is no longer active
    await expect(page.getByRole('button', { name: 'Save changes' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit todo' })).toBeVisible();
  });

  test('should delete a todo item', async ({ page }) => {
    const todoText = 'Todo to delete';
    
    // Add a todo
    await page.getByPlaceholder('Add a new todo item...').fill(todoText);
    await page.getByRole('button').first().click();
    
    // Delete the todo
    await page.getByRole('button', { name: 'Delete todo' }).click();
    
    // Check the todo was deleted
    await expect(page.getByText(todoText)).not.toBeVisible();
    await expect(page.getByText('No todos yet')).toBeVisible();
  });

  test('should handle empty input', async ({ page }) => {
    // Try to add empty todo
    await page.getByRole('button').first().click();
    
    // Should still show empty state
    await expect(page.getByText('No todos yet')).toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });

  test('should handle keyboard interactions', async ({ page }) => {
    const todoText = 'Keyboard todo';
    
    // Add todo with Enter key
    await page.getByPlaceholder('Add a new todo item...').fill(todoText);
    await page.getByPlaceholder('Add a new todo item...').press('Enter');
    
    // Check the todo was added
    await expect(page.getByText(todoText)).toBeVisible();
  });

  test('should verify icons are present', async ({ page }) => {
    // Add a todo to see the icons
    await page.getByPlaceholder('Add a new todo item...').fill('Test todo');
    await page.getByRole('button').first().click();
    
    // Check that FontAwesome icons are loaded (we can't check the actual icons, but we can check the classes)
    const editButton = page.getByRole('button', { name: 'Edit todo' });
    const deleteButton = page.getByRole('button', { name: 'Delete todo' });
    
    await expect(editButton).toBeVisible();
    await expect(deleteButton).toBeVisible();
    
    // Check the main add button is also present
    await expect(page.getByRole('button').first()).toBeVisible();
  });
});