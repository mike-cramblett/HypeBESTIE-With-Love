export interface DemoData {
  selfieUrl: string;
  receiptUrl: string;
  scanResult: {
    styleName: string;
    'MCE%': string;
    biometricSpecs: string[];
    hypeText: string;
  };
}

export const DEMO_DATA: DemoData = {
  selfieUrl: '/assets/demo-selfie.jpg',
  receiptUrl: '/assets/demo-hb-receipt.png',
  scanResult: {
    styleName: 'TACTICAL SUNSHINE COMMUTER',
    'MCE%': '99.9%',
    biometricSpecs: [
      '> OPTIC SHIELD: Sleek dark wrap-around sunglasses locked in',
      '> LUMEN EMISSION: Peak high-wattage genuine smile detected',
      '> AERO-DOME: Flawless smooth cranial geometry at 100% polish',
      '> ATMOSPHERIC VIBE: Bus window golden hour daylight saturation',
    ],
    hypeText:
      'BESTIE LOOK AT THIS RADIANCE ☀️😎 You are literally beaming pure main character joy in this transit selfie! Those sleek dark wrap-around sunglasses are giving ultimate action-hero cool 🔥 while that electric genuine smile is bringing total sunshine straight through the window! The smooth polished dome is reflecting peak confidence ✨ and that classic blue tee keeps it effortlessly grounded 💙 You are single-handedly turning a casual ride into a high-octane celebration of life and pure good energy ✨ absolute legend behavior!',
  },
};