/**
 * Task Registration.
 *
 * Import all React task providers organized by domain.
 * Tasks self-register via doAction('prpl.tasks.register') when imported.
 *
 * Domain organization enables future code splitting if needed.
 */

// Core tasks - basic WordPress setup and configuration
import './core';

// Content tasks - content creation, management, and SEO
import './content';

// Maintenance tasks - WordPress updates and housekeeping
import './maintenance';

// Performance tasks - optimization related
import './performance';
