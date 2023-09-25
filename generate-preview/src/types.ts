type UrlString = 'UrlString'
type AssetToken = 'AssetToken'
type PluginInvocationToken = 'PluginInvocationToken'

type PlaybookAPIConstructorParams = {
  callbackUrl: UrlString;
  pluginInvocationToken: PluginInvocationToken;
};

type PluginInvocationParams = {
  pluginInvocationToken: PluginInvocationToken;
  callbackUrl: UrlString;
  assets: InputAssetType[];
};

type InputAssetType = {
  token: AssetToken;
  url: UrlString;
  title: string;
  type: string;
};

type CreatePlaceholderAssetType = {
  title: string;
  group?: AssetToken;
};

type PlaceholderAssetType = {
  token: AssetToken;
  title: string;
  uploadUrl: UrlString;
};
