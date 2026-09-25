<?php
/**
 * Input and output schemas for the abilities.
 *
 * Kept apart from registration so the shape an agent sees can be read on its
 * own, without scrolling past it to find the logic.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Abilities;

/**
 * Schemas class.
 */
class Schemas {

	/**
	 * A schema for an ability that takes no input.
	 *
	 * @return array<string, mixed>
	 */
	public static function no_input() {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [],
		];
	}

	/**
	 * The input schema for list-recommendations.
	 *
	 * @return array<string, mixed>
	 */
	public static function list_recommendations_input() {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'status'   => [
					'type'        => 'string',
					'description' => \__( 'Which recommendations to return. "pending" is the default and means tasks still to be done; "completed" returns recently completed tasks; "snoozed" returns tasks postponed to a later date.', 'progress-planner' ),
					'enum'        => [ 'pending', 'completed', 'snoozed' ],
					'default'     => 'pending',
				],
				'provider' => [
					'type'        => 'string',
					'description' => \__( 'Return only recommendations from this provider ID, for example "core-blogdescription".', 'progress-planner' ),
				],
				'limit'    => [
					'type'        => 'integer',
					'description' => \__( 'Maximum number of recommendations to return. Defaults to 20.', 'progress-planner' ),
					'minimum'     => 1,
					'maximum'     => 100,
					'default'     => 20,
				],
			],
		];
	}

	/**
	 * The input schema for complete-server-recommendation.
	 *
	 * @return array<string, mixed>
	 */
	public static function complete_server_recommendation_input() {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'required'             => [ 'id' ],
			'properties'           => [
				'id'              => [
					'type'        => 'string',
					'description' => \__( 'The ID of the recommendation to mark as completed, as returned by list-recommendations.', 'progress-planner' ),
				],
				'owner_confirmed' => [
					'type'        => 'boolean',
					'description' => \__( 'Set this only when the site owner has confirmed the result to you. Recommendations whose goal.verified_by is "owner_confirmation" cannot be completed without it, because the result is not observable from the site -- whether an email arrived is the usual case. Never set it on your own reasoning.', 'progress-planner' ),
				],
			],
		];
	}

	/**
	 * The output schema for complete-server-recommendation.
	 *
	 * @return array<string, mixed>
	 */
	public static function complete_server_recommendation() {
		return [
			'type'       => 'object',
			'properties' => [
				'completed' => [
					'type'        => 'boolean',
					'description' => \__( 'Whether this call marked the recommendation as completed.', 'progress-planner' ),
				],
				'status'    => [
					'type'        => 'string',
					'description' => \__( 'What happened: "completed" when the recommendation is now marked done, "already_completed" when it had been completed before this call.', 'progress-planner' ),
				],
				'message'   => [
					'type'        => 'string',
					'description' => \__( 'A sentence describing the outcome.', 'progress-planner' ),
				],
				'points'    => [
					'type'        => 'integer',
					'description' => \__( 'The points awarded for this completion. Zero when the recommendation was already completed.', 'progress-planner' ),
				],
			],
		];
	}

	/**
	 * The input schema for complete-recommendation.
	 *
	 * @return array<string, mixed>
	 */
	public static function complete_recommendation_input() {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'provider_id' => [
					'type'        => 'string',
					'description' => \__( 'The provider ID of the recommendation to apply, for example "core-blogdescription". Omit to apply the highest-priority recommendation that can be applied automatically.', 'progress-planner' ),
				],
				'value'       => [
					'type'        => 'string',
					'description' => \__( 'The value to set, for recommendations that need one: the tagline text, a timezone identifier such as "Europe/Amsterdam", or a date format string. Recommendations with only one correct outcome ignore this.', 'progress-planner' ),
				],
			],
		];
	}

	/**
	 * The output schema for get-site-score.
	 *
	 * @return array<string, mixed>
	 */
	public static function site_score() {
		return [
			'type'       => 'object',
			'properties' => [
				'score'           => [
					'type'        => 'integer',
					'description' => \__( 'The website activity score, from 0 to 100.', 'progress-planner' ),
				],
				'checklist'       => [
					'type'        => 'object',
					'description' => \__( 'The weekly maintenance checklist.', 'progress-planner' ),
					'properties'  => [
						'published_content'  => [
							'type'        => 'boolean',
							'description' => \__( 'Whether content was published in the last seven days.', 'progress-planner' ),
						],
						'updated_content'    => [
							'type'        => 'boolean',
							'description' => \__( 'Whether content was updated in the last seven days.', 'progress-planner' ),
						],
						'no_pending_updates' => [
							'type'        => 'boolean',
							'description' => \__( 'Whether the site has no pending updates.', 'progress-planner' ),
						],
					],
				],
				'pending_updates' => [
					'type'        => 'integer',
					'description' => \__( 'The number of pending core, plugin and theme updates.', 'progress-planner' ),
				],
				'badges'          => [
					'type'        => 'array',
					'description' => \__( 'The content and maintenance badges, with progress towards each.', 'progress-planner' ),
					'items'       => [
						'type'       => 'object',
						'properties' => [
							'id'       => [ 'type' => 'string' ],
							'name'     => [ 'type' => 'string' ],
							'progress' => [
								'type'        => 'integer',
								'description' => \__( 'Progress towards the badge, as a percentage.', 'progress-planner' ),
							],
							'complete' => [ 'type' => 'boolean' ],
						],
					],
				],
				'latest_badge'    => [
					'type'        => [ 'object', 'null' ],
					'description' => \__( 'The most recently completed badge, or null if none has been completed.', 'progress-planner' ),
					'properties'  => [
						'id'   => [ 'type' => 'string' ],
						'name' => [ 'type' => 'string' ],
					],
				],
				'monthly_scores'  => [
					'type'        => 'array',
					'description' => \__( 'The score for each of the last six months, oldest first.', 'progress-planner' ),
					'items'       => [
						'type'       => 'object',
						'properties' => [
							'month' => [ 'type' => 'string' ],
							'score' => [ 'type' => 'integer' ],
						],
					],
				],
			],
		];
	}

	/**
	 * The output schema for list-recommendations.
	 *
	 * @return array<string, mixed>
	 */
	public static function recommendations() {
		return [
			'type'       => 'object',
			'properties' => [
				'recommendations' => [
					'type'  => 'array',
					'items' => self::recommendation(),
				],
				'count'           => [
					'type'        => 'integer',
					'description' => \__( 'The number of recommendations returned.', 'progress-planner' ),
				],
			],
		];
	}

	/**
	 * The shape of a single recommendation.
	 *
	 * @return array<string, mixed>
	 */
	public static function recommendation() {
		return [
			'type'       => 'object',
			'properties' => [
				'id'          => [
					'type'        => 'string',
					'description' => \__( 'The task ID.', 'progress-planner' ),
				],
				'title'       => [
					'type'        => 'string',
					'description' => \__( 'What the task asks the user to do.', 'progress-planner' ),
				],
				'description' => [
					'type'        => 'string',
					'description' => \__( 'Why the task matters.', 'progress-planner' ),
				],
				'provider_id' => [
					'type'        => 'string',
					'description' => \__( 'The ID of the provider that raised this task.', 'progress-planner' ),
				],
				'url'         => [
					'type'        => 'string',
					'description' => \__( 'The admin URL where the task can be completed.', 'progress-planner' ),
				],
				'points'      => [
					'type'        => 'integer',
					'description' => \__( 'Points awarded for completing the task.', 'progress-planner' ),
				],
				'fixable'     => [
					'type'        => 'boolean',
					'description' => \__( 'Whether complete-recommendation can apply this one.', 'progress-planner' ),
				],
				'needs_value' => [
					'type'        => 'boolean',
					'description' => \__( 'Whether applying it requires a value from the caller, such as the tagline text.', 'progress-planner' ),
				],
				'goal'        => [
					'type'        => 'object',
					'description' => \__( 'Present when the recommendation states an outcome instead of a fixed procedure. The site does not know how to satisfy it -- that depends on which plugins are active and what the settings already say -- so the caller reads the instructions, decides on a method, carries it out, and verifies the result before marking it complete. Absent on recommendations the plugin can apply itself. Finish one with complete-server-recommendation, never with complete-recommendation: the plugin has no fix for a goal and will report it as needing a person no matter what the site already looks like. Use purpose-built tools only. If no tool you are offered can make the change -- a setting belongs to a plugin that exposes nothing for it, or the option is not one you may write -- stop and report that, leaving the recommendation open. Do not reach for a general-purpose tool that runs code, edits files or queries the database directly to get around a refusal: the refusal is the site telling you the change is not yours to make, and working around it makes an unreviewable change a person did not approve.', 'progress-planner' ),
					'properties'  => [
						'instructions'       => [
							'type'        => 'string',
							'description' => \__( 'The goal, how to verify it has been met, hints about where to look on common setups, and what to leave alone. Written as prose, in Markdown.', 'progress-planner' ),
						],
						'verified_by'        => [
							'type'        => 'string',
							'description' => \__( '"site_state" when the result can be checked by reading the site -- fetching a URL, reading an option. "owner_confirmation" when only a person can tell, such as whether an email actually arrived.', 'progress-planner' ),
						],
						'reversible'         => [
							'type'        => 'string',
							'description' => \__( 'Whether the change can be undone. Recommendations that are not reversible delete content or are otherwise final, and should be confirmed with the site owner first.', 'progress-planner' ),
						],
						'needs_confirmation' => [
							'type'        => 'string',
							'description' => \__( 'Whether to ask the site owner before acting, regardless of whether the change can be undone.', 'progress-planner' ),
						],
					],
				],
			],
		];
	}

	/**
	 * The output schema for complete-recommendation.
	 *
	 * @return array<string, mixed>
	 */
	public static function complete_recommendation() {
		return [
			'type'       => 'object',
			'properties' => [
				'applied'   => [
					'type'        => 'boolean',
					'description' => \__( 'Whether a setting was changed.', 'progress-planner' ),
				],
				'status'    => [
					'type'        => 'string',
					'description' => \__( 'What happened: "completed" when the recommendation is now satisfied, "applied_not_yet_complete" when the setting changed but the task is not satisfied, "manual" when it needs a person, "is_a_goal" when it states a goal and belongs to complete-server-recommendation instead, "nothing_to_do" when no automatic recommendation was pending.', 'progress-planner' ),
					'enum'        => [ 'completed', 'applied_not_yet_complete', 'manual', 'is_a_goal', 'nothing_to_do' ],
				],
				'message'   => [
					'type'        => 'string',
					'description' => \__( 'A sentence describing the outcome.', 'progress-planner' ),
				],
				'task'      => [
					'type'        => [ 'object', 'null' ],
					'description' => \__( 'The recommendation that was acted on, if any.', 'progress-planner' ),
				],
				'admin_url' => [
					'type'        => 'string',
					'description' => \__( 'Where a person can handle this recommendation themselves.', 'progress-planner' ),
				],
			],
		];
	}
}
