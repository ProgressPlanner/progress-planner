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
			],
		];
	}
}
