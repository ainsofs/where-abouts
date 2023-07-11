<?php

namespace Drupal\sprep_whereabouts\Plugin\Field;

use Drupal\Core\Field\FieldItemList;
use Drupal\Core\TypedData\ComputedItemListTrait;

class MyComputedField extends FieldItemList
{

  use ComputedItemListTrait;

  /**
   * Computes the field value.
   */
  protected function computeValue()
  {
    $this->list[0] = $this->createItem(0, 'My computed field value');
  }
}
