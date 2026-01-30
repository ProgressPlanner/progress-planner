# Directory Structure

## Top Level

```
progress-planner/
├── .claude/                    # Claude workspace config
├── .github/                    # GitHub Actions workflows (17 files)
├── .husky/                     # Git hooks (pre-commit)
├── .planning/                  # Planning documents
├── .vscode/                    # VS Code settings
├── .wordpress-org/             # WordPress.org plugin assets
├── assets/                     # Frontend assets (CSS, JS, images)
├── bin/                        # Utility scripts (install-wp-tests.sh)
├── classes/                    # PHP classes (164 files)
├── tests/                      # Test suites (PHPUnit + Playwright)
├── vendor/                     # Composer dependencies (gitignored)
├── views/                      # PHP template files
├── node_modules/               # npm dependencies (gitignored)
│
├── progress-planner.php        # Main plugin entry point
├── autoload.php                # Custom PSR-4 autoloader
├── uninstall.php               # Plugin uninstall handler
│
├── composer.json               # PHP dependencies
├── package.json                # JS dependencies
├── phpcs.xml.dist              # PHPCS ruleset
├── phpstan.neon.dist           # PHPStan config (level 10)
├── phpunit.xml.dist            # PHPUnit config
├── playwright.config.js        # Playwright E2E config
├── .php-cs-fixer.dist.php      # PHP-CS-Fixer config
├── .eslintrc.js                # ESLint config
├── .stylelintrc.json           # stylelint config
├── .editorconfig               # Editor formatting
├── .distignore                 # Distribution exclusions
├── .gitattributes              # Git attributes
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment template
│
├── CHANGELOG.md                # Version history
├── LICENSE                     # GPL-3.0+
├── README.md                   # Project documentation
├── SECURITY.md                 # Security policy
└── readme.txt                  # WordPress.org readme
```

## classes/ (164 PHP files)

```
classes/
├── class-base.php                     # Service locator (569 lines)
├── class-badges.php                   # Badge manager
├── class-lessons.php                  # Lessons system
├── class-onboard-wizard.php           # Onboarding flow (604 lines)
├── class-page-todos.php               # Post-meta todos
├── class-page-types.php               # Page type detection
├── class-plugin-deactivation.php      # Deactivation handler
├── class-plugin-installer.php         # Plugin installation
├── class-plugin-migrations.php        # Migration runner
├── class-plugin-upgrade-tasks.php     # Upgrade task runner
├── class-settings.php                 # Settings manager
├── class-suggested-tasks-db.php       # Suggested tasks DB layer
├── class-suggested-tasks.php          # Suggestions manager (642 lines)
├── class-todo.php                     # Todo/checklist manager
│
├── actions/                           # WordPress action handlers
│   ├── class-content.php              #   Content actions
│   ├── class-content-scan.php         #   Content scanning
│   └── class-maintenance.php          #   Maintenance actions
│
├── activities/                        # Activity tracking
│   ├── class-activity.php             #   Activity model
│   ├── class-content.php              #   Content activities
│   ├── class-content-helpers.php      #   Content helpers
│   ├── class-maintenance.php          #   Maintenance activities
│   ├── class-query.php                #   DB query builder
│   └── class-suggested-task.php       #   Suggested task activity
│
├── admin/                             # Admin UI
│   ├── class-dashboard-widget.php     #   WP dashboard widget base
│   ├── class-dashboard-widget-score.php
│   ├── class-dashboard-widget-todo.php
│   ├── class-editor.php               #   Block editor integration
│   ├── class-enqueue.php              #   Asset enqueueing
│   ├── class-page.php                 #   Main admin page
│   ├── class-page-settings.php        #   Settings page
│   ├── class-tour.php                 #   Guided tour
│   └── widgets/                       #   Page widgets
│       ├── class-widget.php           #     Base widget
│       ├── class-activity-scores.php
│       ├── class-badge-streak.php
│       ├── class-badge-streak-content.php
│       ├── class-badge-streak-maintenance.php
│       ├── class-challenge.php
│       ├── class-content-activity.php
│       ├── class-monthly-badges.php
│       ├── class-suggested-tasks.php
│       └── class-todo.php
│
├── badges/                            # Achievement system
│   ├── class-badges.php               #   Badge manager
│   ├── class-badge-content.php        #   Content badges
│   └── class-badge-maintenance.php    #   Maintenance badges
│
├── goals/                             # Goal management
│   ├── class-goal.php                 #   Goal model
│   └── class-goal-recurring.php       #   Recurring goals
│
├── rest/                              # REST API
│   ├── class-base.php                 #   Base with token auth
│   ├── class-stats.php                #   Stats endpoint
│   └── class-tasks.php                #   Tasks endpoint (827 lines)
│
├── suggested-tasks/                   # Task recommendation engine
│   ├── class-suggested-tasks.php      #   Manager
│   ├── data-collector/                #   Data collectors (20+ files)
│   │   ├── class-data-collector-manager.php
│   │   ├── class-uncategorized-category.php
│   │   ├── class-terms-without-posts.php
│   │   ├── class-terms-without-description.php
│   │   ├── class-post-author.php
│   │   ├── class-post-tag-count.php
│   │   └── ... (SEO, content, metadata analyzers)
│   └── providers/                     #   Task providers
│       ├── class-tasks.php            #     Base provider
│       ├── integrations/              #     Third-party integrations
│       │   ├── yoast/                 #       Yoast SEO (22 files)
│       │   └── aioseo/               #       AIOSEO (12 files)
│       └── traits/                    #     Shared traits
│           ├── class-ajax-security-base.php
│           ├── class-ajax-security-yoast.php
│           ├── class-ajax-security-aioseo.php
│           ├── class-dismissable-task.php
│           └── class-task-action-builder.php
│
├── third-party/                       # Third-party integrations
│
├── ui/                                # UI components
│   ├── class-branding.php             #   Branding/URLs
│   ├── class-chart.php                #   Chart rendering
│   └── class-popover.php             #   Popover/modal
│
├── update/                            # Version migrations
│   ├── class-update.php               #   Base update class
│   ├── class-update-130.php
│   ├── class-update-140.php
│   ├── class-update-161.php
│   ├── class-update-170.php
│   ├── class-update-172.php
│   ├── class-update-190.php
│   ├── class-update-1100.php
│   └── class-update-111.php
│
├── utils/                             # Utilities
│   ├── class-cache.php                #   Caching layer
│   ├── class-date.php                 #   Date utilities
│   ├── class-debug-tools.php          #   Debug tools (803 lines)
│   ├── class-deprecations.php         #   Deprecation handler
│   ├── class-onboard.php              #   Onboarding data
│   ├── class-playground.php           #   WP Playground support
│   ├── class-plugin-migration-helpers.php
│   ├── class-system-status.php        #   System diagnostics
│   └── traits/
│       └── class-input-sanitizer.php  #   Sanitization trait
│
└── wp-cli/                            # CLI commands
    ├── class-get-stats-command.php     #   Stats command
    └── class-task-command.php          #   Task management command
```

## assets/

```
assets/
├── css/
│   ├── dashboard-widgets/       # Dashboard widget styles
│   ├── onboarding/              # Onboarding flow styles
│   ├── page-widgets/            # Admin page widget styles
│   ├── vendor/                  # Third-party CSS
│   └── web-components/          # Web component styles
├── images/
│   └── onboarding/              # Onboarding images
└── js/
    ├── onboarding/              # Onboarding scripts
    ├── recommendations/         # Recommendation scripts
    ├── vendor/                  # Third-party JS
    ├── web-components/          # Web component scripts
    └── widgets/                 # Widget scripts
```

## views/

```
views/
├── dashboard-widgets/           # WP dashboard widget templates
├── js-templates/                # JavaScript templates
├── onboarding/                  # Onboarding templates
│   ├── form-inputs/             #   Form input partials
│   └── tasks/                   #   Task templates
├── page-widgets/                # Admin page widget templates
│   └── parts/                   #   Template parts
├── popovers/                    # Popover/modal templates
│   └── parts/                   #   Popover parts
└── setting/                     # Settings page templates
```

## tests/

```
tests/
├── bootstrap.php                # Test bootstrap/config
├── bin/                         # Test utilities
├── phpunit/                     # PHPUnit tests (58 files)
│   ├── integration/             #   Integration tests
│   └── traits/                  #   Test traits
└── e2e/                         # Playwright E2E tests
    ├── auth.setup.js            #   Global auth setup/teardown
    ├── constants/               #   Test constants
    ├── helpers/                  #   E2E helper functions
    ├── sequential/              #   Sequential test specs
    └── *.spec.js                #   Parallel test specs
```
