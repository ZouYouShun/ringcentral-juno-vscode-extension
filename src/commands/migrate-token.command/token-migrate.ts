const confirmWithDesigner = '/* please confirm with designer that color */';

export const tokenMapping = {
  'background-default': 'neutral-b01',
  'background-elevation': 'neutral-elevation',
  'background-transparent': 'neutral-transparent',
  'bg-light': 'neutral-b02',
  'bg-dark': 'neutral-b03',
  'bg-primaryLightest': 'neutral-b02',
  'bg-primaryLight': null,
  'bg-primary': 'interactive-b02',
  'bg-secondary': 'highlight-b03',
  'bg-negative': 'danger-b04',
  'bg-positive': 'success-b04',
  'bg-neutral': 'neutral-b04',
  'bg-critical': 'warning-b03',
  'bg-redLight': 'danger-f01',
  'bg-orangeLight': 'highlight-b02',
  'bg-yellowLight': 'warning-b02',
  'bg-greenLight': 'success-f01',
  'bg-tiffanyLight': null,
  'bg-blueLight': 'interctive-b01',
  'bg-purpleLight': null,
  'bg-redLightest': 'danger-b01',
  'bg-orangeLightest': 'highlight-b01',
  'bg-yellowLightest': 'warning-b01',
  'bg-greenLightest': 'success-b01',
  'bg-tiffanyLightest': null,
  'bg-blueLightest': 'informative-b01',
  'bg-purpleLightest': null,
  'neutral-transparentDark': 'neutral-b05',
  'bg-buttonDisabled': 'disabled-b01',
  'bg-mentionMe': 'highlight-b02',
  'bg-meetingNow': 'highlight-b01+0.08opacity',
  'bg-meetingNext': 'success-b05+0.08opacity',
  'bg-highlight': 'highlight-b01',
  'globalHeader-bgLight': 'header-bgRight',
  'globalHeader-bgDark': 'header-bgLeft',
  'globalHeader-bgDefault': 'dialHeader-bg',
  'globalHeader-bgTransparent': 'header-bgOverlay',
  'globalHeader-bgTransparentDisabled': 'header-bgOverlayDisabled',
  'globalHeader-text': 'header-text',
  'globalHeader-textHint': 'header-textHint',
  'globalHeader-icon': 'header-icon',
  'globalHeader-iconDisabled': 'header-iconDisabled',
  'globalHeader-critical': 'warning-f11',
  'globalHeader-positive': 'success-f11',
  'globalHeader-border': 'header-focusBorder',
  'globalHeader-avatarBg': 'dialHeader-avatarBg',
  'globalHeader-avatarIcon': 'dialHeader-avatarIcon',
  'globalHeader-dialTextHint': 'dialHeader-textHint',
  'globalHeader-dialText': 'dialHeader-text',
  'globalHeader-dialIcon': 'dialHeader-icon',
  'globalHeader-divider': 'header-divider',
  'element-default': 'neutral-f02',
  'element-primary': 'interactive-f02',
  'element-negative': 'danger-f02',
  'element-disabled': 'disabled-f02',
  'border-default': 'neutral-l03',
  'border-primary': 'interactive-f01',
  'border-primaryLightest': null,
  'border-secondary': 'highlight-f02',
  'border-redLight': 'danger-f01',
  'border-negative': 'danger-f02',
  'border-inverse': 'highContrast',
  'border-light': 'neutral-l02',
  'border-neutral': 'neutral-l04',
  'border-paper': 'neutral-l01',
  'border-rcv': null,
  'text-dark': 'neutral-f06',
  'text-default': 'neutral-f05',
  'text-subdued': 'neutral-f04',
  'text-button': 'interactive-f01',
  'text-info': 'interactive-f01',
  'text-secondaryInfo': 'highlight-f02',
  'text-link': 'informative-f02',
  'text-negative': 'danger-f02',
  'text-positive': 'success-f02',
  'text-critical': 'highlight-f02',
  'text-warning': 'warning-f02',
  'text-inverse': 'neutral-f01',
  'text-bgPrimary': 'neutral-f01',
  'text-bgSecondary': 'neutral-f01',
  'text-bgNegative': 'neutral-f01',
  'text-bgPositive': 'neutral-f01',
  'text-bgNeutral': 'neutral-f01',
  'text-bgCritical': 'neutral-f07',
  'text-hint': 'neutral-f03',
  'text-disabled': 'neutral-f02',
  'text-mentionMe': 'highlight-f01',
  'icon-subdued': 'neutral-f04',
  'icon-default': 'neutral-f04',
  'icon-dark': 'neutral-f06',
  'icon-primary': 'interactive-f01',
  'icon-negative': 'danger-f02',
  'icon-positive': 'success-f02',
  'icon-critical': 'warning-f02',
  'icon-secondary': 'highlight-f02',
  'icon-inverse': 'neutral-f01',
  'icon-bookmark': 'nav-bookmark',
  'icon-disabled': 'neutral-f02',
  'label-red-icon': 'label-red01',
  'label-red-text': 'label-red02',
  'label-orange-icon': 'label-orange01',
  'label-orange-text': 'label-orange02',
  'label-yellow-icon': 'label-yellow01',
  'label-yellow-text': 'label-yellow02',
  'label-green-icon': 'label-green01',
  'label-green-text': 'label-green02',
  'label-tiffany-icon': 'label-teal01',
  'label-tiffany-text': 'label-teal02',
  'label-blue-icon': 'label-blue01',
  'label-blue-text': 'label-blue02',
  'label-purple-icon': 'label-purple01',
  'label-purple-text': 'label-purple02',
  'label-black-icon': 'label-black02',
  'label-black-text': 'label-black02',
  'avatar-tomato': null,
  'avatar-blueberry': null,
  'avatar-oasis': null,
  'avatar-gold': null,
  'avatar-sage': null,
  'avatar-ash': null,
  'avatar-persimmon': null,
  'avatar-pear': null,
  'avatar-brass': null,
  'avatar-lake': null,
  'avatar-default': 'avatar-global',
  'presence-busy': 'presence-busy',
  'presence-on': 'presence-available',
  'presence-off': 'presence-invisible',
  divider: 'neutral-l02',
  dividerLight: 'neutral-l02',
  highContrast: null,
  'action-grayLight': null,
  'action-grayDark': null,
  'action-primary': null,
  'action-secondary': null,
  'action-negative': 'danger-f02',
  'action-positive': null,
  'action-warning': null,
  'action-white': null,
  'semantic-negative': ['danger-b04', confirmWithDesigner],
  'semantic-positive': ['success-b04', confirmWithDesigner],
  'semantic-critical': ['warning-b03', confirmWithDesigner],
  'semantic-neutral': ['neutral-b04', confirmWithDesigner],
};
