// helpers and variables for tiles saving themselves

// important attributes saved in each tile
const bitDetailsIndex = {
  LIGHT_LEVEL: 0,
  WATER_LEVEL: 1,
  SPECIES: 2,
  GROWTH_LEVEL: 3,
};

// amount bits per attribute
const bitLayout = [
  { bits: 2, shift: 0, mask: 0 },
  { bits: 2, shift: 0, mask: 0 },
  { bits: 10, shift: 0, mask: 0 },
  { bits: 2, shift: 0, mask: 0 },
];
let tileBitSize = 0;
for (let i of bitLayout) {
  tileBitSize += i.bits;
}
const wholeTileMask = calculateMask(tileBitSize);
// helper function for masking bits in a given file
function calculateMask(bits: number) {
  return (1 << bits) - 1;
}

function bitsRequired(n: number) {
  if (n === 0) return 1; // Special case: 0 still needs 1 bit for representation
  return Math.floor(Math.log2(n)) + 1;
}

// modifies the bit layout to include attribute shift + mask
let shift = 0;
bitLayout.forEach((bitInfo) => {
  bitInfo.shift = shift;
  shift += bitInfo.bits;
  bitInfo.mask = calculateMask(bitInfo.bits);
});

export const bitWiseHelper = {
    bitDetailsIndex: bitDetailsIndex,
    bitLayout: bitLayout,
    wholeTileMask: wholeTileMask,
    calculateMask: calculateMask
}