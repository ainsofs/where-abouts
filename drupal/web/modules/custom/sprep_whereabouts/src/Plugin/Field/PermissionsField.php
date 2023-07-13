<?php

namespace Drupal\sprep_whereabouts\Plugin\Field;

use Drupal\Core\Field\FieldItemList;
use Drupal\Core\TypedData\ComputedItemListTrait;

class PermissionsField extends FieldItemList
{

  use ComputedItemListTrait;

  /**
   * Computes the field value.
   */
  protected function computeValue()
  {
    /** @var \Drupal\Core\Session\AccountInterface $current_user */
    $current_user = \Drupal::currentUser();

    // Get the current user's permissions.
    // $permissions1 = $current_user->getPermissions();

    $permissions = [
      'canEditOwn' => $current_user->hasPermission('edit own wb_people content'),
      'canEditDepartment' => FALSE,
      'canEditAll' => $current_user->hasPermission('edit any wb_people content'),
    ];

    foreach($permissions as $key => $value) {
      $formatted = $value ? 1 : 0;
      $this->list[$key] = $this->createItem($key, $key.":".$formatted);
    }
  }
}
