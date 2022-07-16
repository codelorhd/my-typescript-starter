import User from "../../users/entities/user.entity";

const mockedUser: User = {
    id: "1",
    email: 'user@email.com',
    name: 'John',
    password: '$2b$10$LcCkI9uFktOMuIDnxVYRceeCEBIH2/PC/fSMh6iyDrgvYXDUTZSGa', //strongPASSWORD
    address: {
        id: "1",
        street: 'streetName',
        city: 'cityName',
        country: 'countryName'
    }
}

export default mockedUser