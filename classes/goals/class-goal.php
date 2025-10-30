<?php
/**
 * An object containing info about an individual goal.
 *
 * This object is meant to be extended by individual goal classes.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Goals;

/**
 * An object containing info about an individual goal.
 */
class Goal {

	/**
	 * The goal ID.
	 *
	 * @var string
	 */
	protected string $id;

	/**
	 * The goal title.
	 *
	 * @var string
	 */
	protected string $title;

	/**
	 * The goal description.
	 *
	 * @var string
	 */
	protected string $description;

	/**
	 * The goal type.
	 *
	 * @var string
	 */
	protected string $type;

	/**
	 * The goal start date.
	 *
	 * @var string|\DateTime
	 */
	protected $start_date;

	/**
	 * The goal end date.
	 *
	 * @var string|\DateTime
	 */
	protected $end_date;

	/**
	 * The goal status.
	 *
	 * @var string
	 */
	protected string $status;

	/**
	 * The goal priority.
	 *
	 * @var string
	 */
	protected string $priority;

	/**
	 * The goal progress.
	 *
	 * @var string
	 */
	protected string $progress;

	/**
	 * The goal evaluation function.
	 *
	 * @var string|callable
	 */
	protected $evaluate;

	/**
	 * Constructor.
	 *
	 * @param array $args The goal arguments.
	 */
	public function __construct( array $args = [] ) {
		$args              = \wp_parse_args(
			$args,
			[
				'id'          => '',
				'title'       => '',
				'description' => '',
				'type'        => '',
				'start_date'  => '',
				'end_date'    => '',
				'status'      => '',
				'priority'    => '',
				'progress'    => '',
				'evaluate'    => '__return_false',
			]
		);
		$this->id          = $args['id'];
		$this->title       = $args['title'];
		$this->description = $args['description'];
		$this->type        = $args['type'];
		$this->start_date  = $args['start_date'];
		$this->end_date    = $args['end_date'];
		$this->status      = $args['status'];
		$this->priority    = $args['priority'];
		$this->progress    = $args['progress'];
		$this->evaluate    = $args['evaluate'];
	}

	/**
	 * Get the goal ID.
	 *
	 * @return array
	 */
	public function get_details() {
		return [
			'id'          => $this->id,
			'title'       => $this->title,
			'description' => $this->description,
			'type'        => $this->type,
			'start_date'  => $this->start_date,
			'end_date'    => $this->end_date,
			'status'      => $this->status,
			'priority'    => $this->priority,
			'progress'    => $this->progress,
			'evaluate'    => $this->evaluate,
		];
	}

	/**
	 * Set the start date.
	 *
	 * @param string|\DateTime $start_date The start date.
	 *
	 * @return void
	 */
	public function set_start_date( $start_date ): void {
		$this->start_date = $start_date;
	}

	/**
	 * Set the end date.
	 *
	 * @param string|\DateTime $end_date The end date.
	 *
	 * @return void
	 */
	public function set_end_date( $end_date ): void {
		$this->end_date = $end_date;
	}

	/**
	 * Whether this goal has been accomplished or not.
	 *
	 * @return bool
	 */
	public function evaluate() {
		$callback = $this->get_details()['evaluate'];
		return $callback( $this );
	}
}
