const Redis = require("ioredis");

const IOREDIS_CONNECTION =
  process.env.SMARTMOVE_REDIS || "redis://127.0.0.1:6379";
const redis = new Redis(IOREDIS_CONNECTION);

const getFavorites = async () => {
  const favorites = await redis.get("Favorites");
  return JSON.parse(favorites || "[]");
};

const removeFavorite = async favorite => {
  const favorites = await getFavorites();

  const newFavorites = favorites.filter(
    f =>
      f.id !== favorite.id || f.uid !== favorite.uid || f.type !== favorite.type
  );
  await redis.set("Favorites", JSON.stringify(newFavorites));

  return {...favorite, timestamp: Number.parseInt(Date.now())};
};

const addFavorite = async favorite => {
  const favorites = await getFavorites();

  const newFavorites = favorites
    ? favorites.filter(
        f =>
          f.id !== favorite.id ||
          f.type !== favorite.type ||
          f.uid !== favorite.uid
      )
    : [];
  newFavorites.push(favorite);

  await redis.set("Favorites", JSON.stringify(newFavorites));

  return favorite;
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
