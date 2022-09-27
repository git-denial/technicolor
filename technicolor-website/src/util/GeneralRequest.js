export default class GeneralRequest {

    static set = async (endpoint, method, body) => {
        console.log(`[${method}] ${endpoint}`)

        let response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(body)
        });

        if(response.ok){
            console.log('response : ', response)

            return response.json()
        }else{
            let error = await response.json()

            console.log('error : ', error)

            throw error

        }
    }
}
