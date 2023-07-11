<?php

use Drupal\taxonomy\Entity\Term;

// Add project.
$teams = [
  [
    'vid' => 'teams',
    'name' => 'SPREP IT',
  ],
  [
    'vid' => 'teams',
    'name' => 'Knowledge Management Team',
  ],
  [
    'vid' => 'teams',
    'name' => 'Project Coordination Unit',
  ],
  [
    'vid' => 'teams',
    'name' => 'SPREP HR',
  ],
  [
    'vid' => 'teams',
    'name' => 'Finance and Administration',
  ],
];

foreach($teams as $team) {
  $term = Term::create($team);
  $term->enforceIsNew();
  $term->save();
}

// Drupal::state()->set('test_content_installed', TRUE);
