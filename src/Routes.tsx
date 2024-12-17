import { Routes, Route, useNavigate, Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LogIn from './pages/auth/container/login'
import { useEffect, useState } from 'react'
import ForgetPassword from './pages/auth/container/forgetPassword'
import DashBoardLayout from './pages/dashboard/layout'
import DashBoardPage from './pages/dashboard/page'
import SearchPage from './pages/search/page'
import ManagePage from './pages/manage/page'
import NetworkVerificationPage from './pages/networkVerification/page'
import ResetPassword from './pages/auth/container/resetPassword'
import PerspectivePage from './pages/perspective/page'
import ManualEmpanelmentPage from './pages/perspective/manualEmpanelment/page'
import DetailsList from './pages/networkVerification/details'
import PendingVerifyDetailsList from './pages/networkVerification/pendingVerifyDetails'
import LegalVerificationPage from './pages/legalverification/page'
import LegalPendingVerifyDetailsList from './pages/legalverification/pendingVerifyDetails'
import LegalDetailsList from './pages/legalverification/verifyDetails'
import { EUserRole } from './utils/constants'
import SearchDetailsPage from './pages/search/details'
import PendingVerifyDetailsEditList from './pages/networkVerification/edit'
import AutoEditList from './pages/networkVerification/autoEmpanelmentEdit'
import ThankYou from './components/ThankYou'
import PerspectiveDetailsPage from './pages/perspective/detailsOpenRequest'
import Spinner from './components/spinner'
import UnAuthorized from './components/UnAuthorized'
import ManageForNwPage from './pages/manage/nwPage'

type Props = {}

const RoleBasedRoute = ({ element, requiredRole, userRole }: any) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && requiredRole.includes(user.role)) {
        setAuthorized(true)
      } else {
        setAuthorized(false)
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [user, requiredRole])

  if (loading) {
    return (
      <div className='flex flex-col h-screen items-center justify-center'>
        <Spinner />
        <span className='text-blue-main font-normal text-xl pt-3'>
          You and me both have memories...
        </span>
      </div>
    )
  }

  return authorized ? element : <Navigate to='/unauthorized' replace />
}

const RequireAuth = ({}: Props) => {
  const { authParams } = useAuth()
  return authParams.isAuth ? <Outlet /> : <Navigate to='/login' replace />
}

const NF = ({}: Props) => {
  const { authParams } = useAuth()
  return <Navigate to={authParams.isAuth ? '/' : '/login'} replace />
}

const AppRoutes = ({}: Props) => {
  const { authParams, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (
      authParams.isAuth &&
      ['/login', '/forget-password', '/reset-password', '/'].includes(location.pathname)
    ) {
      if (user?.role === EUserRole.Legal) {
        navigate('/search')
      } else {
        navigate('/dashboard')
      }
    }
    // if (!authParams.isAuth && location.pathname === '/') {
    //   navigate('/login')
    // }
  }, [authParams.isAuth, location.pathname, navigate])
  return (
    <Routes>
      {!authParams.isAuth && (
        <>
          <Route path={'/login'} element={<LogIn />} />
          <Route path={'/forget-password'} element={<ForgetPassword />} />
          <Route path={'/reset-password'} element={<ResetPassword />} />
          <Route path={'/empanelment/auto-empanelment/:id'} element={<ManualEmpanelmentPage />} />
          <Route path={'/empanelment/auto-empanelment/edit/:id'} element={<AutoEditList />} />
          <Route path={'/thankyou'} element={<ThankYou />} />
        </>
      )}
      {authParams.isAuth && (
        <>
          <Route
            path={'/dashboard'}
            element={
              <RoleBasedRoute
                element={
                  <DashBoardLayout>
                    <DashBoardPage />
                  </DashBoardLayout>
                }
                requiredRole={[EUserRole.Operation, EUserRole.Network]}
              />
            }
          />
          {/* <Route
            path={'/dashboard'}
            element={<DashBoardLayout>{<DashBoardPage />}</DashBoardLayout>}
          /> */}
          <Route
            path={'/manage/nw'}
            element={<DashBoardLayout>{<ManageForNwPage />}</DashBoardLayout>}
          />
          <Route path={'/search'} element={<DashBoardLayout>{<SearchPage />}</DashBoardLayout>} />
          <Route
            path={'/search/details'}
            element={<DashBoardLayout>{<SearchDetailsPage />}</DashBoardLayout>}
          />
          <Route path={'/manage'} element={<DashBoardLayout>{<ManagePage />}</DashBoardLayout>} />
          <Route
            path={'/network-verification'}
            element={<DashBoardLayout>{<NetworkVerificationPage />}</DashBoardLayout>}
          />
          <Route
            path={'/legal-verification'}
            element={<DashBoardLayout>{<LegalVerificationPage />}</DashBoardLayout>}
          />
          <Route
            path={'/empanelment/perspective'}
            element={<DashBoardLayout>{<PerspectivePage />}</DashBoardLayout>}
          />
          <Route
            path={'/empanelment/perspective-from-open'}
            element={<DashBoardLayout>{<PerspectiveDetailsPage />}</DashBoardLayout>}
          />
          <Route
            path={'/empanelment/manual-empanelment/:id'}
            element={<DashBoardLayout>{<ManualEmpanelmentPage />}</DashBoardLayout>}
          />
          <Route
            path={'/network-verification/network-verify-details'}
            element={<DashBoardLayout>{<DetailsList />}</DashBoardLayout>}
          />
          <Route
            path={'/network-verification/network-pending-verify-details'}
            element={<DashBoardLayout>{<PendingVerifyDetailsList />}</DashBoardLayout>}
          />
          <Route
            path={'/network-verification/network-pending-edit-details'}
            element={<DashBoardLayout>{<PendingVerifyDetailsEditList />}</DashBoardLayout>}
          />
          <Route
            path={'/legal-verification/legal-verify-details'}
            element={<DashBoardLayout>{<LegalDetailsList />}</DashBoardLayout>}
          />
          <Route
            path={'/legal-verification/legal-pending-verify-details'}
            element={<DashBoardLayout>{<LegalPendingVerifyDetailsList />}</DashBoardLayout>}
          />
        </>
      )}
      <Route
        path={'/unauthorized'}
        element={
          <DashBoardLayout>
            <UnAuthorized />
          </DashBoardLayout>
        }
      />
      <Route element={<RequireAuth />}>
        {/* <Route key='/block' path='/block' element={<DashBoardLayout children={<Outlet />} />}>
          <Route key='' path='' element={<BlockList />} />
          <Route key='floor' path='floor' element={<Outlet />}>
            <Route key='' path='' element={<FloorList />} />
            <Route key='resident' path='resident' element={<Outlet />}>
              <Route key='' path='' element={<ResidentList />} />
              <Route key='member' path='member' element={<MemberList />} />
            </Route>
          </Route>
        </Route> */}
        {/* <Route
          key='/member'
          path='/member'
          element={<DashBoardLayout children={<MemberManagementList />} />}
        /> */}
      </Route>
      <Route path={'*'} element={<NF />} />
    </Routes>
  )
}

export default AppRoutes
