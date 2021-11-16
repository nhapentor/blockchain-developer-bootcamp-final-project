async function fetchAPI(query, { variables } = {}) {

    // const body = JSON.stringify({
    //   query,
    //   variables,
    // })
    // console.log(body)
    const res = await fetch(`http://localhost:1338/graphql`, {
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

  export async function getAllEmployees() {
    const data = await fetchAPI(
    `
    query AllEmployees {
      employees {
        id            
        account
        name
        email
        signature
        timestamp
        points
        avatar { 
          id
          url
        }
        isOnboarded
      }
    }
    `,
    )
    return data?.employees
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
        points
        avatar { 
          id
          url
        }
        isOnboarded
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

  export async function searchEmployeeByName(keyword) {
    const data = await fetchAPI(
      `
    query EmployeeNameContain($where: JSON) {
      employees(where: $where) {
        id            
        account
        name
        email
        signature
        timestamp
        points
        avatar { 
          id
          url
        }
        isOnboarded
      }
    }
    `,
      {
        variables: {
          where: { 
            name_contains: keyword
          },
        },
      }
    )

    return data?.employees
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
            points
            avatar { 
              id
              url  
            }
            isOnboarded
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
    const input = {...employee, id: undefined, avatar: Number(employee.avatar.id) } 

    const data = await fetchAPI(
      `
      mutation updateEmployee($employee: editEmployeeInput, $where: InputID) {
        updateEmployee(input: { 
          where: $where
          data: $employee }) {
          employee {
            id
            avatar { 
              id
              url  
            }
            account
            name
            email
            signature
            timestamp
            points
            isOnboarded
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

  export async function updateEmployeeSignature(employeeId, signature = '', timestamp = 0) {

    const id = Number(employeeId)
    const data = { signature, timestamp } 

    const res = await fetchAPI(
      `
      mutation updateEmployee($employee: editEmployeeInput, $where: InputID) {
        updateEmployee(input: { 
          where: $where
          data: $employee }) {
          employee {
            id
            avatar { 
              id
              url  
            }
            account
            name
            email
            signature
            timestamp
            points
          }
        }
      }
      `,
      {
        variables: {
          employee: data,
          where: { id }
        },
      }
    )

    return res.updateEmployee.employee
  }

  export async function uploadMedia(image) {

    const formData = new FormData();
    formData.append('files', image)

    const res = await fetch(`http://localhost:1338/upload`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })
  
    const json = await res.json()

    if (json.errors) {
      console.error(json.errors)
      throw new Error('Failed to fetch API')
    }
  
    return json[0]
    
  }