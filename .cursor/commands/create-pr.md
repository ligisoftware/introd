# Create Pull Request

This command helps create a pull request by:
1. Checking if you're on the main branch
2. Running swiftformat to format code
3. Creating a new branch from the current changes
4. Committing all changes with a properly formatted commit message
5. Pushing the branch to remote
6. Creating a PR using GitHub CLI (gh)
7. Opening the PR in your browser

## PR Title Format
- Use imperative mood (e.g., "Add feature X" not "Added feature X")
- Be concise and descriptive
- Include the area/component if relevant (e.g., "Forge: Add RemoteImage component")

## PR Description Structure

### Summary
- Provide a high-level overview of what the PR does and why
- Focus on the "what" and "why", not the "how" (implementation details belong in code)
- Keep it brief - 2-3 sentences maximum

### Changes
- List the main changes at a high level
- Group related changes together
- Avoid listing every file changed or minor implementation details
- Focus on user-visible or architectural changes

### Testing
- Note any manual testing performed
- Mention if automated tests were added/updated
- Skip trivial changes that don't require special testing

## What to Exclude
- ❌ Don't list every file changed
- ❌ Don't include implementation details that are obvious from code review
- ❌ Don't document minor refactorings or code style changes
- ❌ Don't include "Updated X.swift" - that's obvious from the diff

## What to Include
- ✅ High-level feature description
- ✅ Breaking changes or migration notes
- ✅ Dependencies added/removed
- ✅ Configuration changes
- ✅ User-facing changes
- ✅ Performance implications if significant

## Example Good PR Description

```
## Summary
Replaces Nuke-based image loading with a custom RemoteImage component in Forge, removing the external Nuke dependency.

## Changes
- Added new RemoteImage component to Forge with built-in caching
- Updated LigiAsyncImage to use Forge's RemoteImage
- Removed Nuke and NukeUI dependencies from all packages
- Updated all Package.swift files to remove Nuke references

## Testing
- Verified image loading works correctly in workout previews and profile views
- Confirmed no regressions in existing image display functionality
```

## Example Bad PR Description (too detailed)

```
## Summary
This PR updates the image loading system.

## Changes
- Updated RemoteImage.swift to remove NukeUI import
- Changed LazyImage to RemoteImage in LigiAsyncImage.swift
- Removed .nuke from Package.swift dependencies
- Updated Forge/Package.swift line 44
- Updated LigiCore/Package.swift line 90
- Removed Nuke from project.pbxproj
- Updated 23 files total
```

