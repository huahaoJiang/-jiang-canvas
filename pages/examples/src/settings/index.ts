export { default as themeSettings } from './theme.json'
import type { GlobalThemeOverrides } from 'naive-ui'
export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#722ED1',
    primaryColorHover: '#9254DE',
    primaryColorPressed: '#B37FEB',
    primaryColorSuppl: '#D3ADF7'
  },
  Menu: {
    itemTextColor: '#120338',
    itemTextColorChildActiveHorizontal: '#22075E',
    itemTextColorChildActiveHoverHorizontal: '#391085',
    itemTextColorActiveHorizontal: '#22075E',
    itemTextColorHoverHorizontal: '#391085',
    itemTextColorActiveHoverHorizontal: '#391085'
  },
  Card: {
    paddingMedium: '16px',
    boxShadow: '0px 6px 30px 5px rgba(0, 0, 0, 0.05)',
    borderRadius: '4px',
    titleFontSizeSmall: '14px'
  },
  DataTable: {
    tdPaddingMedium: '16px 6px',
    thPaddingMedium: '12px 6px',
    thPaddingSmall: '12px 8px',
    tdPaddingSmall: '8px',
    tdTextColor: '#666',
    thTextColor: '#333',
    tdColorHover: '#FBFBFB'
  },
  Button: {
    paddingSmall: '2px 8px',
    paddingMedium: '4px 8px',
    heightMedium: '28px',
    heightLarge: '36px'
  },
  Tag: {
    padding: '3px 4px',
    borderRadius: '4px',
    heightTiny: '18px',
    textColorWarning: '#E58F3A'
  },
  DatePicker: {},
  Rate: {
    itemColor: '#DAEBF1'
  },
  Input: {
    heightLarge: '44px'
  },
  Anchor: {
    linkFontSize: '14px'
  }
}

export const paginationThemeOverrides = {
  itemTextColor: '#054163',
  itemTextColorHover: '#fff',
  itemTextColorActive: '#fff',

  itemColor: '#EDF5F8',
  itemColorHover: '#0073B4',
  itemColorActive: '#0073B4',
  itemColorActiveHover: '#0073B4',

  buttonColor: '#EDF5F8',
  buttonColorHover: '#EDF5F8',
  buttonIconColor: '#054163',
  buttonIconColorHover: '#054163',
  buttonBorder: 'none',
  buttonBorderHover: 'none',

  itemBorderDisabled: 'none',
  itemColorDisabled: '#EDF5F8',
  itemTextColorDisabled: '#054163',

  jumperTextColor: '#054163',

  peers: {
    Select: {
      peers: {
        InternalSelection: {
          border: 'none',
          borderHover: 'none',
          borderActive: 'none',
          borderFocus: 'none',
          boxShadowActive: 'none',
          boxShadowFocus: 'none',
          color: '#EDF5F8',
          colorActive: '#EDF5F8',
          textColor: '#054163',
          arrowColor: '#054163'
        }
      }
    },
    Input: {
      border: '1px solid #C8E1EA',
      textColor: '#054163'
    }
  }
}

export const tableThemeOverrides = {
  tdColorHover: '#E5F1F7',
  thColor: '#F2F8FB',
  thColorHover: '#F2F8FB'
}
