const Instagram = require("instagram-web-api");

const username = process.env.SMARTMOVE_INSTAGRAM_USERNAME;
const password = process.env.SMARTMOVE_INSTAGRAM_PASSWORD; // Only required when no cookies are stored yet

const client = new Instagram({username, password});

const getInstagramProfile = async () =>
  client.login().then(() => client.getProfile());

const locationSearch = async ({query, latitude, longitude}) =>
  client
    .login()
    .then(() => client.locationSearch({query, latitude, longitude}));

const getMediaFeedByLocation = async ({locationId}) =>
  client.login().then(() => client.getMediaFeedByLocation({locationId}));

const getPhotosByHashtag = async ({hashtag}) =>
  await client.getPhotosByHashtag({hashtag});

const getInstagramFeedByLocation = async params => {
  const {name, latitude, longitude} = params;
  const locations = await locationSearch({query: name, latitude, longitude});
  const locationId = locations[0]?.external_id || 0;
  const media = await getMediaFeedByLocation({locationId});
  return media?.native_location_data;
};

const getInstagramFeedByHashtag = async params => {
  const {hashtag} = params;
  const photos = await getPhotosByHashtag({hashtag});
  return photos?.hashtag?.edge_hashtag_to_media?.edges?.slice(0, 12) || [];
};

const getInstagramFeedByUsername = async ({username}) =>
  client.login().then(() => client.getPhotosByUsername({username}));

const getInstagramMediaByShortcode = async shortcode =>
  client.login().then(() => client.getMediaByShortcode({shortcode}));

module.exports = {
  getInstagramFeedByLocation,
  getInstagramFeedByHashtag,
  getInstagramFeedByUsername,
  getInstagramMediaByShortcode,
  getInstagramProfile,
};

// https://github.com/jlobos/instagram-web-api#locationsearchparams
// https://developers.facebook.com/docs/instagram/oembed
