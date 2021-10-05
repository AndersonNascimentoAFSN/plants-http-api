const Countries = {
  brazil: 8,
  other: 7,
};

const waterFrequency = (origin = 'other', needsSun, size) => {
  if (needsSun) return size * 0.77 + Countries[origin]; 

  return (size / 2) * 1.33 + Countries[origin];
};

const serializePlants = (plant) => ({
  breed: plant.breed,
  needsSun: plant.needsSun,
  origin: plant.origin,
  size: plant.size,
  specialCare: {
    waterFrequency: waterFrequency(plant.origin, plant.needsSun, plant.size),
    ...plant.specialCare,
  },
});

module.exports = {
  serializePlants,
};
