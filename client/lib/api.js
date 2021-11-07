async function fetchAPI(query, { variables } = {}) {

    // const body = JSON.stringify({
    //   query,
    //   variables,
    // })
    // console.log(body)
    const res = await fetch(`http://localhost:1337/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
  
    const json = await res.json()
    if (json.errors) {
      console.error(json.errors)
      throw new Error('Failed to fetch API')
    }
  
    return json.data
  }

  export async function getEmployeeByAccount(account) {
    const data = await fetchAPI(
      `
    query EmployeeByAccount($where: JSON) {
      employees(where: $where) {
        id            
        account
        name
        email
        signature
        timestamp
      }
    }
    `,
      {
        variables: {
          where: {
            account,
          },
        },
      }
    )
    return data?.employees[0]
  }

  export async function createEmployee(employee) {
    const data = await fetchAPI(
      `
      mutation createEmployee($employee: EmployeeInput) {
        createEmployee(input: { 
          data: $employee }) {
          employee {
            id
            account
            name
            email
            signature
            timestamp
          }
        }
      }
      `,
      {
        variables: {
          employee
        },
      }
    )

    return data.createEmployee.employee
  }

  export async function updateEmployee(employee) {

    const id = Number(employee.id)
    const input = {...employee, id: undefined }

    const data = await fetchAPI(
      `
      mutation updateEmployee($employee: editEmployeeInput, $where: InputID) {
        updateEmployee(input: { 
          where: $where
          data: $employee }) {
          employee {
            id
            account
            name
            email
            signature
            timestamp
          }
        }
      }
      `,
      {
        variables: {
          employee: input,
          where: { id }
        },
      }
    )

    return data.updateEmployee.employee
  }