<?php
/**
 * Handler for content activities.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Activities;

/**
 * Handler for content activities.
 */
class Content extends Activity {

	/**
	 * Category of the activity.
	 *
	 * @var string
	 */
	public $category = 'content';

	/**
	 * Points configuration for content activities.
	 *
	 * @var array
	 */
	public static $points_config = [
		'publish' => 50,
		'update'  => 10,
		'delete'  => 5,
	];

	/**
	 * Get WP_Post from the activity.
	 *
	 * @return \WP_Post|null
	 */
	public function get_post() {
		return \get_post( (int) $this->data_id );
	}

	/**
	 * Get the points for an activity.
	 *
	 * @param \DateTime $date The date for which we want to get the points of the activity.
	 *
	 * @return int
	 */
	public function get_points( $date ) {
		$date_ymd = $date->format( 'Ymd' );
		if ( isset( $this->points[ $date_ymd ] ) ) {
			return $this->points[ $date_ymd ];
		}

		// Get the number of days between the activity date and the given date.
		$days = \absint( \progress_planner()->get_utils__date()->get_days_between_dates( $date, $this->date ) );

		// Maximum range for awarded points is 30 days.
		if ( $days >= 30 ) {
			$this->points[ $date_ymd ] = 0;
			return $this->points[ $date_ymd ];
		}

		// Get the points for the activity on the publish date.
		$this->points[ $date_ymd ] = $this->get_points_on_publish_date();

		// Bail early if the post score is 0.
		if ( 0 === $this->points[ $date_ymd ] ) {
			return $this->points[ $date_ymd ];
		}

		// Calculate the points based on the age of the activity.
		$this->points[ $date_ymd ] = ( $days < 7 )
			? \round( $this->points[ $date_ymd ] ) // If the activity is new (less than 7 days old), award full points.
			: \round( $this->points[ $date_ymd ] * \max( 0, ( 1 - $days / 30 ) ) ); // Decay the points based on the age of the activity.

		return (int) $this->points[ $date_ymd ];
	}

	/**
	 * Get the points for an activity.
	 *
	 * @return int
	 */
	public function get_points_on_publish_date() {
		$points = self::$points_config['publish'];
		if ( isset( self::$points_config[ $this->type ] ) ) {
			$points = self::$points_config[ $this->type ];
		}

		return $this->get_post() ? $points : 0;
	}
}
