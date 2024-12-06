// Important attributes saved in each tile
const bitDetailsIndex = {
  LIGHT_LEVEL: 0,
  WATER_LEVEL: 1,
  SPECIES: 2,
  GROWTH_LEVEL: 3,
} as const;

// Define the number of bits required for each attribute.
interface BitLayoutAttribute {
  bits: number;   // Number of bits used to represent this attribute
  shift: number;  // Bit position offset within the tile
  mask: number;   // Mask for isolating this attribute's bits
}
const bitLayout: Array<BitLayoutAttribute> = [
  { bits: 3, shift: 0, mask: 0 }, // LIGHT_LEVEL: Requires 3 bits
  { bits: 5, shift: 0, mask: 0 }, // WATER_LEVEL: Requires 5 bits
  { bits: 6, shift: 0, mask: 0 }, // SPECIES: Requires 6 bits
  { bits: 2, shift: 0, mask: 0 }, // GROWTH_LEVEL: Requires 2 bits
]

// Calculate total bits required to encode a tile.
let tileBitSize = 0
for (let i of bitLayout) {
  tileBitSize += i.bits
}

// Calculate the full-tile mask based on the total number of tile bits.
const wholeTileMask = calculateMask(tileBitSize)

// Update the `bitLayout` to include `shift` (position offset) and `mask` for each attribute.
let shift = 0
bitLayout.forEach((bitInfo) => {
  bitInfo.shift = shift
  shift += bitInfo.bits
  bitInfo.mask = calculateMask(bitInfo.bits)
})

export const bitWiseHelper = {
    bitDetailsIndex: bitDetailsIndex,
    bitLayout: bitLayout,
    wholeTileMask: wholeTileMask,
    calculateMask: calculateMask
}

//#region --------------------------------------- FUNCITON

// Computes a binary mask for a given number of bits.
function calculateMask(bits: number): number {
  return (1 << bits) - 1;
}

// Determines the number of bits required to represent a maximum value `n`.
function _bitsRequired(n: number): number {
  if (n === 0) return 1; // Special case: 0 still needs 1 bit for representation
  return Math.floor(Math.log2(n)) + 1;
}

//#endregion