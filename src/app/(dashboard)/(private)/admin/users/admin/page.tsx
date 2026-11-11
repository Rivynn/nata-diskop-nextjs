import AdminList from '@views/admin/users/admin'
import { getUserData } from '@/app/server/actions'

const AdminUsersPage = async () => {
  const users = await getUserData()

  const adminData = users.filter(
    user => user.role === 'admin'
  )

  return <AdminList adminData={adminData} />
}

export default AdminUsersPage
