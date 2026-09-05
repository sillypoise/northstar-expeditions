// Shared domain checks must work in both the static builder and the planner browser island.
export function invariant(
    condition: boolean,
    message = "Domain invariant failed.",
): asserts condition {
    if (condition === false) throw new Error(message);
}
