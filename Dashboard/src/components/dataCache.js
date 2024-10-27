(async () => {
    const { cacheData, getCachedData } = require('./cache');
    const fetch = (await import('node-fetch')).default;

    const fetchAndCacheAverages = async () => {
        const response = await fetch('http://localhost:5000/api/ndt-results/averages');
        const data = await response.json();

        if (response.ok) {
            cacheData('networkPerformanceAverages', data);
        } else {
            console.error('Failed to fetch data:', data.message);
        }
    };

    
    const fetchIsp = async () => {
        const response = await fetch('http://localhost:5000/api/ndt-results/top-isps');
        const names = await response.json();

        if(response.ok){
            cacheData('isps',names);
        }
        else{
            console.error('Failed to fetch the data:',names.message);
        }
    };

    
    const fetchPlaces = async () => {
        const response = await fetch('http://localhost:5000/api/ndt-results/top-places');
        const places = await response.json();

        if(response.ok){
            cacheData('places',places);
        }
        else{
            console.error('Failed to fetch the data:',places.message);
        }
    };

    const runPreAppScript = async () => {
        await fetchAndCacheAverages();
        await fetchIsp();
        await fetchPlaces();
        console.log('Data cached successfully. You can now start the app.');
    };


    runPreAppScript();
})();
