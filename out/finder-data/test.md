# Dynamic Loading Test

This file is loaded dynamically via `fetch` when selected in the Finder!
It means the file system is statically defined, but content is fetched only on-demand, saving memory and speeding up load times.

## Advantages
- **Fast Initial Load**: Only the metadata is loaded initially.
- **Low Memory**: Files are not stored in memory until clicked.
- **Static VFS**: Easy to manage and customize.
