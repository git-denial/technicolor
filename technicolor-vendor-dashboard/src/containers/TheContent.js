import React, { Suspense, useEffect } from 'react'
import {
  Redirect,
  Route,
  Switch,
  useHistory
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

// routes config
import routes from '../routes'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const TheContent = () => {
  const loginAs = sessionStorage.getItem('loginAs');
  const vendorId = sessionStorage.getItem('vendorId');
  const history = useHistory();
  useEffect(() => {
    if(!localStorage.token && !sessionStorage.token){
      history.push('/login')
    }else if(localStorage.token === undefined && sessionStorage.token === undefined){
      history.push('/login')
    }

  }, [])

  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade>
                      <route.component {...props} />
                    </CFade>
                  )} />
              )
            })}
            <Redirect from="/" to={loginAs === 'admin' ? '/users' : '/my-product/' + vendorId} />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
