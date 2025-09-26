import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

//constants
import {
  layoutTypes,
  layoutModeTypes,
  layoutWidthTypes,
  topBarThemeTypes,
  leftBarThemeImageTypes,
  leftSidebarTypes,
  leftSideBarThemeTypes,
} from '../constants/layout'

// DOM manipulation utilities (moved from saga)
const changeBodyAttribute = (attribute: string, value: string) => {
  if (document.body) document.body.setAttribute(attribute, value)
  return true
}

const changeHtmlAttribute = (attribute : string, value: string) => {
  if (document.documentElement) document.documentElement.setAttribute(attribute, value)
  return true
}

const manageBodyClass = (cssClass: string, action = 'toggle') => {
  switch (action) {
    case 'add':
      if (document.body) document.body.classList.add(cssClass)
      break
    case 'remove':
      if (document.body) document.body.classList.remove(cssClass)
      break
    default:
      if (document.body) document.body.classList.toggle(cssClass)
      break
  }
  return true
}

// Initial state
const initialState = {
  layoutType: layoutTypes.VERTICAL,
  layoutModeType: layoutModeTypes.LIGHT,
  layoutWidth: layoutWidthTypes.FLUID,
  leftSideBarTheme: leftSideBarThemeTypes.DARK,
  leftSideBarThemeImage: leftBarThemeImageTypes.NONE,
  leftSideBarType: leftSidebarTypes.DEFAULT,
  topbarTheme: topBarThemeTypes.LIGHT,
  isPreloader: false,
  showRightSidebar: false,
  isMobile: false,
  showSidebar: true,
  leftMenu: false,
}

// Async thunks for complex layout changes
export const changeLayoutAsync = createAsyncThunk(
  'layout/changeLayout',
  async (layout) => {
    if (layout === 'horizontal') {
      document.body.removeAttribute('data-sidebar')
      document.body.removeAttribute('data-sidebar-image')
      document.body.removeAttribute('data-sidebar-size')
    }
    
    changeBodyAttribute('data-layout', layout)
    return layout
  }
)

export const changeLayoutModeAsync = createAsyncThunk(
  'layout/changeLayoutMode',
  async (mode) => {
    changeHtmlAttribute('data-bs-theme', mode)
    return mode
  }
)

export const changeLayoutWidthAsync = createAsyncThunk(
  'layout/changeLayoutWidth',
  async (width : string, { dispatch }) => {
    if (width === 'boxed') {
      dispatch(changeSidebarTypeAsync({ sidebarType: 'icon' }))
      changeBodyAttribute('data-layout-size', width)
      changeBodyAttribute('data-layout-scrollable', false)
    } else if (width === 'scrollable') {
      dispatch(changeSidebarTypeAsync({ sidebarType: 'default' }))
      changeBodyAttribute('data-layout-scrollable', true)
    } else {
      dispatch(changeSidebarTypeAsync({ sidebarType: 'default' }))
      changeBodyAttribute('data-layout-size', width)
      changeBodyAttribute('data-layout-scrollable', false)
    }
    return width
  }
)

export const changeSidebarThemeAsync = createAsyncThunk(
  'layout/changeSidebarTheme',
  async (theme :string ) => {
    changeBodyAttribute('data-sidebar', theme)
    return theme
  }
)

export const changeSidebarThemeImageAsync = createAsyncThunk(
  'layout/changeSidebarThemeImage',
  async (theme : string) => {
    changeBodyAttribute('data-sidebar-image', theme)
    return theme
  }
)

export const changeTopbarThemeAsync = createAsyncThunk(
  'layout/changeTopbarTheme',
  async (theme : string) => {
    changeBodyAttribute('data-topbar', theme)
    return theme
  }
)

export const changeSidebarTypeAsync = createAsyncThunk(
  'layout/changeSidebarType',
  async ({ sidebarType, isMobile }: { sidebarType: string; isMobile?: boolean }) => {
    switch (sidebarType) {
      case 'compact':
        changeBodyAttribute('data-sidebar-size', 'small')
        manageBodyClass('sidebar-enable', 'remove')
        manageBodyClass('vertical-collpsed', 'remove')
        break
      case 'icon':
        changeBodyAttribute('data-sidebar-size', '')
        changeBodyAttribute('data-keep-enlarged', 'true')
        manageBodyClass('vertical-collpsed', 'add')
        break
      case 'condensed':
        manageBodyClass('sidebar-enable', 'add')
        if (window.screen.width >= 992) {
          manageBodyClass('vertical-collpsed', 'remove')
          manageBodyClass('sidebar-enable', 'remove')
          manageBodyClass('vertical-collpsed', 'add')
          manageBodyClass('sidebar-enable', 'add')
        } else {
          manageBodyClass('sidebar-enable', 'add')
          manageBodyClass('vertical-collpsed', 'add')
        }
        break
      default:
        changeBodyAttribute('data-sidebar-size', '')
        manageBodyClass('sidebar-enable', 'remove')
        if (!isMobile)
          manageBodyClass('vertical-collpsed', 'remove')
        break
    }
    
    return { sidebarType, isMobile }
  }
)

export const showRightSidebarAsync = createAsyncThunk(
  'layout/showRightSidebar',
  async (isOpen : boolean) => {
    if (isOpen) {
      manageBodyClass('right-bar-enabled', 'add')
    } else {
      manageBodyClass('right-bar-enabled', 'remove')
    }
    return isOpen
  }
)

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    // Synchronous layout actions
    changePreloader: (state, action) => {
      state.isPreloader = action.payload
    },
    showSidebar: (state, action) => {
      state.showSidebar = action.payload
    },
    toggleLeftmenu: (state, action) => {
      state.leftMenu = action.payload
    },
    setMobileView: (state, action) => {
      state.isMobile = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Change layout
      .addCase(changeLayoutAsync.fulfilled, (state, action) => {
        state.layoutType = action.payload
      })
      
      // Change layout mode
      .addCase(changeLayoutModeAsync.fulfilled, (state, action) => {
        state.layoutModeType = action.payload
      })
      
      // Change layout width
      .addCase(changeLayoutWidthAsync.fulfilled, (state, action) => {
        state.layoutWidth = action.payload
      })
      
      // Change sidebar theme
      .addCase(changeSidebarThemeAsync.fulfilled, (state, action) => {
        state.leftSideBarTheme = action.payload
      })
      
      // Change sidebar theme image
      .addCase(changeSidebarThemeImageAsync.fulfilled, (state, action) => {
        state.leftSideBarThemeImage = action.payload
      })
      
      // Change topbar theme
      .addCase(changeTopbarThemeAsync.fulfilled, (state, action) => {
        state.topbarTheme = action.payload
      })
      
      // Change sidebar type
      .addCase(changeSidebarTypeAsync.fulfilled, (state, action) => {
        state.leftSideBarType = action.payload.sidebarType
      })
      
      // Show right sidebar
      .addCase(showRightSidebarAsync.fulfilled, (state, action) => {
        state.showRightSidebar = action.payload
      })
  },
})

// Export synchronous actions
export const { 
  changePreloader, 
  showSidebar, 
  toggleLeftmenu,
  setMobileView
} = layoutSlice.actions

// Export reducer
export default layoutSlice.reducer

// For backward compatibility with existing component usage
export const changeLayout = changeLayoutAsync
export const changeLayoutMode = changeLayoutModeAsync
export const changeLayoutWidth = changeLayoutWidthAsync
export const changeSidebarTheme = changeSidebarThemeAsync
export const changeSidebarThemeImage = changeSidebarThemeImageAsync
export const changeTopbarTheme = changeTopbarThemeAsync
export const changeSidebarType = changeSidebarTypeAsync
export const showRightSidebarAction = showRightSidebarAsync