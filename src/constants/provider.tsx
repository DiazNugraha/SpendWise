import {BanknoteIcon, LandmarkIcon} from 'lucide-react-native';
import {Image, ImageSourcePropType} from 'react-native';

export const providerLogos: Record<string, NodeRequire> = {
  gopay: require('../../assets/icons/providers/gopay.png'),
  dana: require('../../assets/icons/providers/dana.png'),
  ovo: require('../../assets/icons/providers/ovo.png'),
  shopeepay: require('../../assets/icons/providers/shopeepay.png'),
};

export const displayProviderIcon = (providerIdentifier: string) => {
  if (providerIdentifier === 'bank') return <LandmarkIcon size={24} />;

  if (providerIdentifier === 'cash') return <BanknoteIcon size={24} />;

  const fileLocation = providerLogos[providerIdentifier];

  if (!fileLocation) return undefined;

  return <Image source={fileLocation as ImageSourcePropType} style={{width: 24, height: 24}} />;
};
