<?php
/**
 * Class Content_Review_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Content_Review;

/**
 * Content Review test case.
 */
class Content_Review_Test extends \WP_UnitTestCase {

	/**
	 * The Content_Review instance.
	 *
	 * @var Content_Review
	 */
	private $content_review;

	/**
	 * Test post ID.
	 *
	 * @var int
	 */
	private $test_post_id;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		// Set current user to admin.
		\wp_set_current_user( 1 );

		// Get the Content_Review instance.
		$this->content_review = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( 'review-post' );

		// Create a test post with blocks.
		$this->test_post_id = $this->factory->post->create(
			[
				'post_title'   => 'Test Post with Images',
				'post_content' => '<!-- wp:image {"id":123} --><figure class="wp-block-image"><img src="test.jpg" alt="Test image"/></figure><!-- /wp:image --><!-- wp:paragraph --><p>This is a <a href="https://example.com">test link</a> in a paragraph.</p><!-- /wp:paragraph -->',
				'post_status'  => 'publish',
			]
		);
	}

	/**
	 * Tear down test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		// Delete test post and its notes.
		if ( $this->test_post_id ) {
			$this->content_review->delete_notes( $this->test_post_id );
			\wp_delete_post( $this->test_post_id, true );
		}

		\wp_set_current_user( 0 );
		parent::tearDown();
	}

	/**
	 * Test supports_notes method.
	 *
	 * @return void
	 */
	public function test_supports_notes() {
		global $wp_version;

		$result = $this->content_review->supports_notes();

		// Should return true for WP 6.9+ and false for earlier versions.
		$expected = \version_compare( $wp_version, '6.9', '>=' );
		$this->assertEquals( $expected, $result );
	}

	/**
	 * Test create_note method.
	 *
	 * @return void
	 */
	public function test_create_note() {
		$note_content = Content_Review::NOTE_PREFIX . ' Test note content';
		$note_id      = $this->content_review->create_note( $this->test_post_id, $note_content );

		$this->assertIsInt( $note_id );
		$this->assertGreaterThan( 0, $note_id );

		// Verify the note was created correctly.
		$note = \get_comment( $note_id );
		$this->assertInstanceOf( \WP_Comment::class, $note );
		$this->assertEquals( 'note', $note->comment_type );
		$this->assertEquals( $note_content, $note->comment_content );
		$this->assertEquals( '0', $note->comment_approved ); // 0 = open.
	}

	/**
	 * Test get_notes method returns all notes.
	 *
	 * @return void
	 */
	public function test_get_notes_all() {
		// Create two notes.
		$this->content_review->create_note( $this->test_post_id, Content_Review::NOTE_PREFIX . ' Note 1' );
		$this->content_review->create_note( $this->test_post_id, Content_Review::NOTE_PREFIX . ' Note 2' );

		$notes = $this->content_review->get_notes( $this->test_post_id, 'all' );

		$this->assertCount( 2, $notes );
	}

	/**
	 * Test get_notes method filters by status.
	 *
	 * @return void
	 */
	public function test_get_notes_by_status() {
		// Create an open note.
		$open_note_id = $this->content_review->create_note( $this->test_post_id, Content_Review::NOTE_PREFIX . ' Open note' );

		// Create a resolved note.
		$resolved_note_id = $this->content_review->create_note( $this->test_post_id, Content_Review::NOTE_PREFIX . ' Resolved note' );
		\wp_update_comment(
			[
				'comment_ID'       => $resolved_note_id,
				'comment_approved' => 1, // 1 = resolved.
			]
		);

		$open_notes = $this->content_review->get_notes( $this->test_post_id, 'open' );
		$this->assertCount( 1, $open_notes );

		$resolved_notes = $this->content_review->get_notes( $this->test_post_id, 'resolved' );
		$this->assertCount( 1, $resolved_notes );
	}

	/**
	 * Test all_notes_resolved returns null when no notes exist.
	 *
	 * @return void
	 */
	public function test_all_notes_resolved_no_notes() {
		$result = $this->content_review->all_notes_resolved( $this->test_post_id );

		$this->assertNull( $result );
	}

	/**
	 * Test all_notes_resolved returns false when open notes exist.
	 *
	 * @return void
	 */
	public function test_all_notes_resolved_with_open_notes() {
		$this->content_review->create_note( $this->test_post_id, Content_Review::NOTE_PREFIX . ' Open note' );

		$result = $this->content_review->all_notes_resolved( $this->test_post_id );

		$this->assertFalse( $result );
	}

	/**
	 * Test all_notes_resolved returns true when all notes are resolved.
	 *
	 * @return void
	 */
	public function test_all_notes_resolved_all_resolved() {
		$note_id = $this->content_review->create_note( $this->test_post_id, Content_Review::NOTE_PREFIX . ' Note' );
		\wp_update_comment(
			[
				'comment_ID'       => $note_id,
				'comment_approved' => 1,
			]
		);

		$result = $this->content_review->all_notes_resolved( $this->test_post_id );

		$this->assertTrue( $result );
	}

	/**
	 * Test find_image_blocks method.
	 *
	 * @return void
	 */
	public function test_find_image_blocks() {
		$image_blocks = $this->content_review->find_image_blocks( $this->test_post_id );

		$this->assertCount( 1, $image_blocks );
		$this->assertEquals( 'core/image', $image_blocks[0]['block']['blockName'] );
	}

	/**
	 * Test find_image_blocks with nested blocks.
	 *
	 * @return void
	 */
	public function test_find_image_blocks_nested() {
		$nested_post_id = $this->factory->post->create(
			[
				'post_title'   => 'Test Post with Nested Image',
				'post_content' => '<!-- wp:group --><div class="wp-block-group"><!-- wp:image {"id":456} --><figure class="wp-block-image"><img src="nested.jpg" alt="Nested image"/></figure><!-- /wp:image --></div><!-- /wp:group -->',
				'post_status'  => 'publish',
			]
		);

		$image_blocks = $this->content_review->find_image_blocks( $nested_post_id );

		$this->assertCount( 1, $image_blocks );
		$this->assertStringContainsString( '.', $image_blocks[0]['index'] ); // Nested index like "0.0".

		\wp_delete_post( $nested_post_id, true );
	}

	/**
	 * Test delete_notes method.
	 *
	 * @return void
	 */
	public function test_delete_notes() {
		$this->content_review->create_note( $this->test_post_id, Content_Review::NOTE_PREFIX . ' Note 1' );
		$this->content_review->create_note( $this->test_post_id, Content_Review::NOTE_PREFIX . ' Note 2' );

		$deleted = $this->content_review->delete_notes( $this->test_post_id );

		$this->assertEquals( 2, $deleted );

		$remaining_notes = $this->content_review->get_notes( $this->test_post_id, 'all' );
		$this->assertCount( 0, $remaining_notes );
	}

	/**
	 * Test filter_note_avatar for non-PRPL notes.
	 *
	 * @return void
	 */
	public function test_filter_note_avatar_non_prpl_note() {
		// Create a regular comment (not a PRPL note).
		$comment_id = $this->factory->comment->create(
			[
				'comment_post_ID' => $this->test_post_id,
				'comment_content' => 'Regular comment',
				'comment_type'    => 'comment',
			]
		);

		$comment     = \get_comment( $comment_id );
		$args        = [ 'url' => 'https://gravatar.com/test' ];
		$result_args = $this->content_review->filter_note_avatar( $args, $comment );

		// Should not modify args for regular comments.
		$this->assertEquals( 'https://gravatar.com/test', $result_args['url'] );
	}

	/**
	 * Test filter_note_avatar for PRPL notes.
	 *
	 * @return void
	 */
	public function test_filter_note_avatar_prpl_note() {
		$note_id = $this->content_review->create_note( $this->test_post_id, Content_Review::NOTE_PREFIX . ' Test note' );
		$note    = \get_comment( $note_id );

		$args        = [ 'url' => 'https://gravatar.com/test' ];
		$result_args = $this->content_review->filter_note_avatar( $args, $note );

		// Should replace avatar URL with Progress Planner logo.
		$this->assertStringContainsString( 'icon_progress_planner.svg', $result_args['url'] );
		$this->assertTrue( $result_args['found_avatar'] );
	}

	/**
	 * Test inject_image_review_notes method.
	 *
	 * @return void
	 */
	public function test_inject_image_review_notes() {
		$created_notes = $this->content_review->inject_image_review_notes( $this->test_post_id );

		$this->assertCount( 1, $created_notes );

		// Verify the note was created.
		$notes = $this->content_review->get_notes( $this->test_post_id, 'all' );
		$this->assertCount( 1, $notes );
		$this->assertStringContainsString( 'Review Image', $notes[0]->comment_content );
	}

	/**
	 * Test inject_image_review_notes does not create duplicate notes.
	 *
	 * @return void
	 */
	public function test_inject_image_review_notes_no_duplicates() {
		// Inject notes twice.
		$this->content_review->inject_image_review_notes( $this->test_post_id );
		$created_notes = $this->content_review->inject_image_review_notes( $this->test_post_id );

		// Second call should not create new notes.
		$this->assertCount( 0, $created_notes );

		// Should still have only 1 note total.
		$notes = $this->content_review->get_notes( $this->test_post_id, 'all' );
		$this->assertCount( 1, $notes );
	}

	/**
	 * Test inject_link_review_notes method.
	 *
	 * @return void
	 */
	public function test_inject_link_review_notes() {
		$created_notes = $this->content_review->inject_link_review_notes( $this->test_post_id );

		$this->assertCount( 1, $created_notes );

		// Verify the note was created.
		$notes = $this->content_review->get_notes( $this->test_post_id, 'all' );
		$this->assertCount( 1, $notes );
		$this->assertStringContainsString( 'Review Paragraph', $notes[0]->comment_content );
	}

	/**
	 * Test NOTE_PREFIX constant.
	 *
	 * @return void
	 */
	public function test_note_prefix_constant() {
		$this->assertEquals( '[PRPL]', Content_Review::NOTE_PREFIX );
	}

	/**
	 * Test that notes are cleaned up when task is completed.
	 *
	 * @return void
	 */
	public function test_notes_cleaned_up_on_task_completion() {
		// Skip test if notes are not supported (WP < 6.9).
		if ( ! $this->content_review->supports_notes() ) {
			$this->markTestSkipped( 'Notes feature requires WordPress 6.9+' );
		}

		// Create and resolve a note.
		$note_id = $this->content_review->create_note( $this->test_post_id, Content_Review::NOTE_PREFIX . ' Test note' );
		\wp_update_comment(
			[
				'comment_ID'       => $note_id,
				'comment_approved' => 1, // Resolved.
			]
		);

		// Verify note exists before completion check.
		$notes_before = $this->content_review->get_notes( $this->test_post_id, 'all' );
		$this->assertCount( 1, $notes_before );

		// Create a task in the database so is_specific_task_completed can find it.
		$task_id   = 'review-post-' . $this->test_post_id;
		$task_data = [
			'task_id'        => $task_id,
			'provider_id'    => 'review-post',
			'target_post_id' => $this->test_post_id,
			'post_title'     => 'Review Test Post',
		];
		\progress_planner()->get_suggested_tasks_db()->add( $task_data );

		// Call the method that checks completion (this should trigger cleanup).
		$reflection = new \ReflectionClass( $this->content_review );
		$method     = $reflection->getMethod( 'is_specific_task_completed' );
		$method->setAccessible( true );
		$is_completed = $method->invoke( $this->content_review, $task_id );

		$this->assertTrue( $is_completed );

		// Notes should be cleaned up after task completion.
		$notes_after = $this->content_review->get_notes( $this->test_post_id, 'all' );
		$this->assertCount( 0, $notes_after );
	}
}
