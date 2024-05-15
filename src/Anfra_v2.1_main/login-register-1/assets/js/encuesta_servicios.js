function getServicesData() {
    const idsPayments = ['checkphone', 'checkentretainment', 'checkother'];
    const selected = idsPayments.filter(id => {
        const element = document.getElementById(id);
        return element && element.checked; 
    })
    .map(id => {
        const label = document.querySelector(`label[for="${id}"]`);
        return label ? label.textContent : ''; 
    });
    const selectedPayments = selected.join(',');

    return{
    "user_id,":convertToInteger( getCookie('id_user') ) ,
	"energy_provider" : convertToBoolean( getHTMLValue('') ),
	"water_provider": convertToBoolean( getHTMLValue('') ),
	"internet_provider" :getHTMLValue('internetprovider') ,
	"phone_provider" : convertToBoolean( getHTMLValue('') ),
	"tv_provider" : convertToBoolean( getHTMLValue('') ),
	"payment_due_date" : getHTMLValue('paytime'),
	"additional_payments": selectedPayments,
	"services_bill": convertToBoolean( getHTMLValue('') )     
    }
}