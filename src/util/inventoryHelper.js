/**
 * @param inventory {Inventory}
 * @param itemType {ItemType}
 * @param delta {number}
 */
export function modifyInventory(inventory, itemType, delta) {
    const stored = inventory.get(itemType) ?? 0;
    const newAmount = stored + delta;
    if (newAmount > 0)
        inventory.set(itemType, newAmount);
    else
        inventory.delete(itemType);
}
