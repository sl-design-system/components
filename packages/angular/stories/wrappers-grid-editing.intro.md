Editing examples for the Angular Grid wrapper.

Use this section to learn inline editing patterns, such as text and select editing in grid columns.

## Form Controls and Data Handling

When using grid editing with form controls, you'll work with the following data structures:

### TextField Example

```typescript
{
  people: Person[]  // e.g., [{ firstName: 'John', lastName: 'Doe', profession: 'Engineer', ... }, ...]
}
```

### Select Example

```typescript
{
  people: Person[],  // e.g., [{ firstName: 'John', lastName: 'Doe', status: 'Available', ... }, ...]
  statuses: ['Available', 'Busy', 'Away']
}
```

The `statuses` array defines the available options for the select dropdown editor. Each item in the `people` array can have its `status` property updated by selecting from these options.
