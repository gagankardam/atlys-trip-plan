import { useEffect, useReducer } from 'react'
import { DemoDock } from './components/DemoDock'
import { Toast } from './components/Toast'
import { reducer, type Screen } from './prototypeState'
import { CreateScreen } from './screens/CreateScreen'
import { InviteScreen } from './screens/InviteScreen'
import { JoinScreen } from './screens/JoinScreen'
import { LandingScreen } from './screens/LandingScreen'
import { PrefsScreen } from './screens/PrefsScreen'
import { RecsScreen } from './screens/RecsScreen'
import { VoteScreen } from './screens/VoteScreen'
import {
  clearSession,
  loadState,
  persistState,
  screenFromHash,
  writeHash,
} from './utils/session'

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    writeHash(state.screen)
    persistState(state)
  }, [state])

  useEffect(() => {
    function onHash() {
      const screen = screenFromHash(window.location.hash)
      if (screen === 'join') {
        dispatch({ type: 'openInviteLink' })
        return
      }
      if (screen && screen !== state.screen) {
        dispatch({ type: 'go', screen })
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [state.screen])

  useEffect(() => {
    if (!state.toast) return
    const timer = window.setTimeout(() => dispatch({ type: 'toast', message: null }), 2400)
    return () => window.clearTimeout(timer)
  }, [state.toast])

  function go(screen: Screen) {
    dispatch({ type: 'go', screen })
  }

  let body = null
  switch (state.screen) {
    case 'landing':
      body = <LandingScreen onStart={() => go('create')} />
      break
    case 'create':
      body = <CreateScreen state={state} dispatch={dispatch} />
      break
    case 'invite':
      body = <InviteScreen state={state} dispatch={dispatch} />
      break
    case 'join':
      body = <JoinScreen state={state} dispatch={dispatch} />
      break
    case 'prefs':
      body = <PrefsScreen state={state} dispatch={dispatch} />
      break
    case 'recs':
      body = <RecsScreen state={state} dispatch={dispatch} />
      break
    case 'vote':
      body = <VoteScreen state={state} dispatch={dispatch} />
      break
    default: {
      const _exhaustive: never = state.screen
      body = _exhaustive
    }
  }

  return (
    <>
      {body}
      <DemoDock
        state={state}
        dispatch={(action) => {
          if (action.type === 'reset') clearSession()
          dispatch(action)
        }}
      />
      <Toast message={state.toast} />
    </>
  )
}
