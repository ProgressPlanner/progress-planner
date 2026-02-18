# Plan: Revert New Onboarding (PR #714) and Preserve Work

## Overview

This plan describes how to revert PR #714 (New User Onboarding) on the `develop` branch while preserving all the new onboarding work on a separate branch.

**PR #714 Details:**
- Merged: December 16, 2025
- Merge commit: `e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516`
- Title: "New user onboarding"

## Current State Analysis

### Commits Since PR #714 (53 total)
The following PRs were merged after #714:
- #746: Site editor sidebar (not onboarding related)
- #744: Fix interactive task resubmission (not onboarding related)
- #743: Safeguards for plugin update (not onboarding related)
- #742: Update for #740 (not onboarding related)
- #741: Onboarding tweaks (**onboarding related**)
- #740: Remove popover positioning (not onboarding related)
- #739: Exclude direct_file_access check (not onboarding related)
- #738: Fix year-week boundary bug (not onboarding related)
- #736: Delay onboarding init (**onboarding related**)
- #733: Reverse filter logic (**onboarding related**)
- #730: New onboarding tweaks (**onboarding related**)

### PRs with Onboarding Changes (need special handling)

| PR | Files Changed | Non-Onboarding Changes |
|----|---------------|------------------------|
| #730 | `assets/css/onboarding/onboarding.css`, `assets/js/onboarding/steps/SettingsStep.js`, `views/onboarding/settings.php` | `classes/class-plugin-upgrade-tasks.php` (upgrade task condition) |
| #733 | `classes/class-onboard-wizard.php`, `tests/phpunit/test-class-onboard-wizard.php` | None |
| #736 | `assets/js/onboarding/onboarding.js`, `classes/class-onboard-wizard.php` | `classes/utils/class-debug-tools.php`, `classes/utils/class-playground.php` |
| #741 | Multiple onboarding views and CSS | None |

### Files Created by PR #714 (New Onboarding)
These files/directories didn't exist before and will need to be **deleted**:
```
assets/css/onboarding/
assets/images/onboarding/
assets/js/onboarding/
classes/class-onboard-wizard.php
tests/phpunit/test-class-onboard-wizard.php
views/onboarding/
```

### Files Deleted by PR #714 (Old Onboarding)
These files need to be **restored** from before the merge:
```
assets/css/onboard.css
assets/css/welcome.css
assets/js/onboard.js
views/welcome.php
```

### Files Modified by PR #714 (Need Selective Revert)
These existing files were modified and need **careful handling**:
```
assets/css/admin.css
assets/js/settings.js
classes/admin/class-page-settings.php
classes/admin/class-page.php
classes/class-base.php
classes/class-suggested-tasks.php
classes/suggested-tasks/class-tasks-interface.php
classes/suggested-tasks/providers/class-blog-description.php
classes/suggested-tasks/providers/class-select-locale.php
classes/suggested-tasks/providers/class-select-timezone.php
classes/suggested-tasks/providers/class-site-icon.php
classes/suggested-tasks/providers/class-tasks.php
classes/ui/class-chart.php
classes/utils/class-date.php
tests/e2e/sequential/onboarding.spec.js
views/admin-page.php
```

---

## Execution Plan

### Phase 1: Preserve New Onboarding Work

1. **Create a preservation branch from current develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b filip/new-onboarding-preserved
   git push -u origin filip/new-onboarding-preserved
   ```

2. **Document the branch purpose**
   Add a note to the branch or create an issue tracking it.

---

### Phase 2: Create Revert Branch

1. **Create revert branch**
   ```bash
   git checkout develop
   git checkout -b revert/old-onboarding
   ```

---

### Phase 3: Restore Old Onboarding Files

1. **Restore deleted files from commit before PR #714**
   The parent commit (before merge) is: `e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516^`

   ```bash
   # Restore old onboarding files
   git checkout e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516^ -- assets/css/onboard.css
   git checkout e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516^ -- assets/css/welcome.css
   git checkout e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516^ -- assets/js/onboard.js
   git checkout e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516^ -- views/welcome.php
   ```

---

### Phase 4: Delete New Onboarding Files

1. **Remove new onboarding directories and files**
   ```bash
   rm -rf assets/css/onboarding/
   rm -rf assets/images/onboarding/
   rm -rf assets/js/onboarding/
   rm -f classes/class-onboard-wizard.php
   rm -f tests/phpunit/test-class-onboard-wizard.php
   rm -rf views/onboarding/
   ```

---

### Phase 5: Revert Modified Files (Manual Review Required)

For each file below, compare the old version with the current version and selectively revert onboarding-related changes while keeping other improvements:

#### 5.1 Core Files (Critical - Review Carefully)

| File | Action |
|------|--------|
| `classes/class-base.php` | Revert `get_license_generator_content` changes |
| `classes/admin/class-page.php` | Restore `welcome_redirect` method |
| `classes/admin/class-page-settings.php` | Review licensing changes |
| `views/admin-page.php` | Revert onboarding container changes |

**Commands to view diffs:**
```bash
# View what changed in each file
git diff e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516^..e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516 -- classes/class-base.php
git diff e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516^..e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516 -- classes/admin/class-page.php
git diff e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516^..e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516 -- views/admin-page.php
```

#### 5.2 Suggested Tasks Providers
These files had changes for onboarding task providers. Review and revert onboarding-specific code:
- `classes/class-suggested-tasks.php`
- `classes/suggested-tasks/class-tasks-interface.php`
- `classes/suggested-tasks/providers/class-blog-description.php`
- `classes/suggested-tasks/providers/class-select-locale.php`
- `classes/suggested-tasks/providers/class-select-timezone.php`
- `classes/suggested-tasks/providers/class-site-icon.php`
- `classes/suggested-tasks/providers/class-tasks.php`

#### 5.3 CSS/JS Files
- `assets/css/admin.css` - Revert onboarding-related styles
- `assets/js/settings.js` - Review changes

#### 5.4 Utility Files
- `classes/ui/class-chart.php` - Review `get_week_badge_gauge_html` method
- `classes/utils/class-date.php` - Review `format_date_for_display` method

---

### Phase 6: Handle Non-Onboarding Changes from Onboarding PRs

**IMPORTANT:** These changes should be kept even though they came from onboarding-related PRs:

1. **From PR #730** - `classes/class-plugin-upgrade-tasks.php`
   - Changed condition for upgrade tasks display
   - **Keep this change** (related to privacy policy acceptance)

2. **From PR #736** - Playground functionality
   - `classes/utils/class-debug-tools.php` - Debug tools for playground
   - `classes/utils/class-playground.php` - Playground hooks and license key insertion
   - **Keep these changes** (but review if they reference new onboarding)

---

### Phase 7: Update E2E Tests

1. **Restore old onboarding E2E tests**
   ```bash
   git checkout e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516^ -- tests/e2e/sequential/onboarding.spec.js
   ```

2. **Review if tests need updates for any other changes made since**

---

### Phase 8: Final Steps

1. **Run tests**
   ```bash
   composer test
   npm run test:e2e
   ```

2. **Run code style checks**
   ```bash
   composer check-cs
   composer phpstan
   ```

3. **Manual testing checklist**
   - [ ] Fresh plugin activation shows old onboarding
   - [ ] Welcome page displays correctly
   - [ ] Onboarding steps work as expected
   - [ ] Dashboard loads without errors
   - [ ] Settings page works correctly
   - [ ] Playground functionality still works

4. **Create PR**
   ```bash
   git add -A
   git commit -m "Revert to old onboarding system

   This reverts the new onboarding introduced in PR #714 and subsequent
   onboarding-related PRs (#730, #733, #736, #741).

   The new onboarding work is preserved in branch: filip/new-onboarding-preserved"

   git push -u origin revert/old-onboarding
   gh pr create --draft --title "Revert to old onboarding system" --body "..."
   ```

---

## Risk Assessment

### High Risk Areas
1. **`classes/class-base.php`** - Core plugin functionality, changes affect initialization
2. **`views/admin-page.php`** - Main dashboard view
3. **Suggested tasks providers** - May have cross-dependencies

### Medium Risk Areas
1. **CSS files** - May affect overall admin styling
2. **E2E tests** - May need updates for CI to pass

### Low Risk Areas
1. **Deleting new onboarding files** - Clean removal
2. **Restoring old files** - Straightforward git checkout

---

## Alternative Approach: Git Revert

Instead of manual file manipulation, you could try:
```bash
git revert --no-commit e7323c4f21c9b71eb4b2ee3f96ae294fd53ca516
```

However, this may cause conflicts with subsequent commits. The manual approach gives more control.

---

## Rollback Plan

If the revert causes issues:
1. The new onboarding is preserved in `filip/new-onboarding-preserved`
2. Can simply close the revert PR without merging
3. Current `develop` remains unchanged until PR is merged

---

## Timeline Estimate

- Phase 1-2: Branch setup - Quick
- Phase 3-4: File restoration/deletion - Quick
- Phase 5: Manual review of modified files - Requires careful review
- Phase 6: Non-onboarding changes - Quick review
- Phase 7-8: Testing and PR - Depends on test results

---

*Plan created: January 21, 2026*
*Last updated: January 21, 2026*
