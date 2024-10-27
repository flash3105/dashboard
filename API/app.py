from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Session
from flask_cors import CORS
from sqlalchemy import desc
from sqlalchemy import asc,func
from datetime import datetime
app = Flask(__name__)

#Enable cors
CORS(app)
# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost/mlab_data'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class UploadResult(db.Model):
    __tablename__ = 'upload_data'
    
    id = db.Column(db.String(255), primary_key=True)
    date = db.Column(db.DateTime)
    MeanThroughputMbps = db.Column(db.Float)
    MinRTT = db.Column(db.Float)
    City = db.Column(db.String(100))
    Latitude = db.Column(db.Float)
    Longitude = db.Column(db.Float)
    ASName = db.Column( db.String(100))


class AverageResult(db.Model):
    __tablename__ = 'ndt7_data'
    
    id = db.Column(db.String(255), primary_key=True)
    date = db.Column(db.DateTime)
    MeanThroughputMbps = db.Column(db.Float)
    MinRTT = db.Column(db.Float)
    LossRate = db.Column(db.Float)
    City = db.Column(db.String(100))
    Latitude = db.Column(db.Float)
    Longitude = db.Column(db.Float)
    ASName = db.Column(db.String(100))


# Model representing the ndt_results_d1 table
class NdtResult(db.Model):
    __tablename__ = 'download_data'
    
    id = db.Column(db.String(255), primary_key=True)
    date = db.Column(db.DateTime)
    MeanThroughputMbps = db.Column(db.Float)
    MinRTT = db.Column(db.Float)
    LossRate = db.Column(db.Float)
    City = db.Column(db.String(100))
    Latitude = db.Column(db.Float)
    Longitude = db.Column(db.Float)
    ASName = db.Column(db.String(100))

#Routes for uploads data set  
@app.route('/api/filter_upload', methods=['GET'])
def filter_results_upload():
    place = request.args.get('place')
    isp = request.args.get('isp')
    
    with Session(db.engine) as session:
        query = session.query(UploadResult)
    
        if place:
            query = query.filter(UploadResult.City == place)
        if isp:
            query = query.filter(UploadResult.ASName == isp)
        
        results = query.order_by(asc(UploadResult.date)).all()

        if results:
            output = []
            for result in results:
                result_data = {
                    'city': result.City,
                    'networkASName': result.ASName,
                    'meanThroughputMbps': result.MeanThroughputMbps,
                    'testTime': result.date
                }
                output.append(result_data)
            return jsonify({'results': output})
        else:
            return jsonify({'message': 'No records found!'}), 404

       
@app.route('/api/histo_upload', methods=['GET'])
def get_average_throughput_by_isp_upload():
    place = request.args.get('place')

    if not place:
        return jsonify({'message': 'Place is required'}), 400

    with Session(db.engine) as session:
        # Query to get average throughput per ISP for the selected place
        results = session.query(
            UploadResult.ASName,
            func.avg(UploadResult.MeanThroughputMbps).label('avg_throughput')
        ).filter(
            UploadResult.City == place
        ).group_by(UploadResult.ASName).order_by(
            func.avg(UploadResult.MeanThroughputMbps).desc()
        ).limit(10).all()

        if results:
            output = [{'isp': result.ASName, 'avg': result.avg_throughput} for result in results]
            return jsonify({'output': output})
        else:
            return jsonify({'message': 'No data found for the selected place'}), 404
    
@app.route('/api/ndt-results/uploads', methods=['GET'])
def get_ndt_uploads():
    with Session(db.engine) as session:
        results = session.query(UploadResult).all()

        if not results:
            return jsonify({'message': 'No data available!'}), 404

        total_speed = 0
        count = len(results)

        for result in results:
            total_speed += result.MeanThroughputMbps or 0

        averages = {
            'averageUploadSpeed': total_speed / count,
        }

        return jsonify(averages)
       

#Routes for AVERAGESs data set  
@app.route('/api/filter_average', methods=['GET'])
def filter_results_average():
    place = request.args.get('place')
    isp = request.args.get('isp')
    
    with Session(db.engine) as session:
        query = session.query(AverageResult)
    
        if place:
            query = query.filter(AverageResult.City == place)
        if isp:
            query = query.filter(AverageResult.ASName == isp)
        
        results = query.order_by(asc(AverageResult.date)).all()

        if results:
            output = []
            for result in results:
                result_data = {
                    'city': result.City,
                    'networkASName': result.ASName,
                    'meanThroughputMbps': result.MeanThroughputMbps,
                    'testTime': result.date
                }
                output.append(result_data)
            return jsonify({'results': output})
        else:
            return jsonify({'message': 'No records found!'}), 404

@app.route('/api/filter_packetloss', methods=['GET'])
def filter_results_packetloss():
    place = request.args.get('place')
    isp = request.args.get('isp')
    
    with Session(db.engine) as session:
        query = session.query(AverageResult)
    
        if place:
            query = query.filter(AverageResult.City == place)
        if isp:
            query = query.filter(AverageResult.ASName == isp)
        
        results = query.order_by(asc(AverageResult.date)).all()

        if results:
            output = []
            for result in results:
                result_data = {
                    'city': result.City,
                    'networkASName': result.ASName,
                    'meanThroughputMbps': result.LossRate,
                    'testTime': result.date
                }
                output.append(result_data)
            return jsonify({'results': output})
        else:
            return jsonify({'message': 'No records found!'}), 404
        
@app.route('/api/filter_latency', methods=['GET'])
def filter_results_latency():
    place = request.args.get('place')
    isp = request.args.get('isp')
    
    with Session(db.engine) as session:
        query = session.query(AverageResult)
    
        if place:
            query = query.filter(AverageResult.City == place)
        if isp:
            query = query.filter(AverageResult.ASName == isp)
        
        results = query.order_by(asc(AverageResult.date)).all()

        if results:
            output = []
            for result in results:
                result_data = {
                    'city': result.City,
                    'networkASName': result.ASName,
                    'meanThroughputMbps': result.MinRTT,
                    'testTime': result.date
                }
                output.append(result_data)
            return jsonify({'results': output})
        else:
            return jsonify({'message': 'No records found!'}), 404

       
@app.route('/api/histo_average', methods=['GET'])
def get_average_throughput_by_isp_Average():
    place = request.args.get('place')

    if not place:
        return jsonify({'message': 'Place is required'}), 400

    with Session(db.engine) as session:
        # Query to get average throughput per ISP for the selected place
        results = session.query(
            AverageResult.ASName,
            func.avg(AverageResult.MeanThroughputMbps).label('avg_throughput')
        ).filter(
            AverageResult.City == place
        ).group_by(AverageResult.ASName).order_by(
            func.avg(AverageResult.MeanThroughputMbps).desc()
        ).limit(10).all()

        if results:
            output = [{'isp': result.ASName, 'avg': result.avg_throughput} for result in results]
            return jsonify({'output': output})
        else:
            return jsonify({'message': 'No data found for the selected place'}), 404

@app.route('/api/histo_latency', methods=['GET'])
def get_average_throughput_by_isp_latency():
    place = request.args.get('place')

    if not place:
        return jsonify({'message': 'Place is required'}), 400

    with Session(db.engine) as session:
        # Query to get average throughput per ISP for the selected place
        results = session.query(
            AverageResult.ASName,
            func.avg(AverageResult.MinRTT).label('avg_throughput')
        ).filter(
            AverageResult.City == place
        ).group_by(AverageResult.ASName).order_by(
            func.avg(AverageResult.MinRTT).desc()
        ).limit(10).all()

        if results:
            output = [{'isp': result.ASName, 'avg': result.avg_throughput} for result in results]
            return jsonify({'output': output})
        else:
            return jsonify({'message': 'No data found for the selected place'}), 404

@app.route('/api/histo_packetloss', methods=['GET'])
def get_average_throughput_by_isp_packetloss():
    place = request.args.get('place')

    if not place:
        return jsonify({'message': 'Place is required'}), 400

    with Session(db.engine) as session:
        # Query to get average throughput per ISP for the selected place
        results = session.query(
            AverageResult.ASName,
            func.avg(AverageResult.LossRate).label('avg_throughput')
        ).filter(
            AverageResult.City == place
        ).group_by(AverageResult.ASName).order_by(
            func.avg(AverageResult.LossRate).desc()
        ).limit(10).all()

        if results:
            output = [{'isp': result.ASName, 'avg': result.avg_throughput} for result in results]
            return jsonify({'output': output})
        else:
            return jsonify({'message': 'No data found for the selected place'}), 404
        
@app.route('/api/networks-by-region', methods=['GET'])
def get_networks_by_region():
    lat = request.args.get('lat', type=float)
    long = request.args.get('long', type=float)
    radius = request.args.get('radius', default=1.0, type=float)  # Optional: define a radius for searching

    if not lat or not long:
        return jsonify({'message': 'Latitude and Longitude are required'}), 400

    with Session(db.engine) as session:
        # Query to find networks within the radius of the given lat/long
        networks = session.query(
            AverageResult.ASName,
            func.count(AverageResult.ASName).label('count'),
            func.avg(AverageResult.LossRate).label('avg_loss_rate'),
            func.avg(AverageResult.MinRTT).label('avg_latency')
        ).filter(
            func.ST_Distance_Sphere(
                func.POINT(AverageResult.Longitude, AverageResult.Latitude),
                func.POINT(long, lat)
            ) <= radius * 1000  # Convert radius to meters
        ).group_by(AverageResult.ASName).all()

        if not networks:
            return jsonify({'message': 'No networks found for the given region'}), 404

        total_occurrences = sum([network.count for network in networks])
        output = [{
            'network': network.ASName,
            'percentage': (network.count / total_occurrences) * 100,
            'averageLoss': (network.avg_loss_rate) * 100,
            'averageLatency': network.avg_latency
        } for network in networks]

        return jsonify({'networks': output})


#Routes for downloads data set 
# Route to get all unique places (cities)
@app.route('/api/places', methods=['GET'])
def get_places():
    with Session(db.engine) as session:
        places = session.query(NdtResult.City).distinct().order_by(asc(NdtResult.City)).all()
        place_list = [place.City for place in places if place.City]
        return jsonify({'places': place_list})

@app.route('/api/isps', methods=['GET'])
def get_isps():
    place = request.args.get('place')
    
    with Session(db.engine) as session:
        query = session.query(NdtResult.ASName).distinct().order_by(asc(NdtResult.ASName))

        if place:
            query = query.filter(NdtResult.City == place)
        
        isps = query.all()
        isp_list = [isp.ASName for isp in isps if isp.ASName]
        
        return jsonify({'isps': isp_list})

@app.route('/api/filter', methods=['GET'])
def filter_results():
    place = request.args.get('place')
    isp = request.args.get('isp')
    
    with Session(db.engine) as session:
        query = session.query(NdtResult)
    
        if place:
            query = query.filter(NdtResult.City == place)
        if isp:
            query = query.filter(NdtResult.ASName == isp)
        
        results = query.order_by(asc(NdtResult.date)).all()

        if results:
            output = []
            for result in results:
                result_data = {
                    'city': result.City,
                    'networkASName': result.ASName,
                    'meanThroughputMbps': result.MeanThroughputMbps,
                    'testTime': result.date
                }
                output.append(result_data)
            return jsonify({'results': output})
        else:
            return jsonify({'message': 'No records found!'}), 404

       
@app.route('/api/histo', methods=['GET'])
def get_average_throughput_by_isp():
    place = request.args.get('place')

    if not place:
        return jsonify({'message': 'Place is required'}), 400

    with Session(db.engine) as session:
        # Query to get average throughput per ISP for the selected place
        results = session.query(
            NdtResult.ASName,
            func.avg(NdtResult.MeanThroughputMbps).label('avg_throughput')
        ).filter(
            NdtResult.City == place
        ).group_by(NdtResult.ASName).order_by(
            func.avg(NdtResult.MeanThroughputMbps).desc()
        ).limit(10).all()

        if results:
            output = [{'isp': result.ASName, 'avg': result.avg_throughput} for result in results]
            return jsonify({'output': output})
        else:
            return jsonify({'message': 'No data found for the selected place'}), 404
       
@app.route('/api/throughput', methods=['GET'])
def get_throughput_by_place():
    place = request.args.get('place')
    
    with Session(db.engine) as session:
        if not place:
            return jsonify({'message': 'Place is required'}), 400

        # Query to get throughput data grouped by ISP for the selected place
        results = session.query(
            NdtResult.ASName,
            NdtResult.date,
            NdtResult.MeanThroughputMbps
        ).filter(
            NdtResult.City == place
        ).order_by(NdtResult.date).all()

        if results:
            output = []
            for result in results:
                output.append({
                    'Network_ASName': result.ASName,
                    'date': result.date,
                    'MeanThroughputMbps': result.MeanThroughputMbps
                })
            return jsonify({'results': output})
        else:
            return jsonify({'message': 'No data found for the selected place'}), 404

# Route to calculate and return the average download speed, latency, and packet loss
@app.route('/api/ndt-results/averages', methods=['GET'])
def get_ndt_averages():
    with Session(db.engine) as session:
        results = session.query(NdtResult).all()

        if not results:
            return jsonify({'message': 'No data available!'}), 404

        total_speed = 0
        total_latency = 0
        total_loss = 0
        count = len(results)

        for result in results:
            total_speed += result.MeanThroughputMbps or 0
            total_latency += result.MinRTT or 0
            total_loss += result.LossRate or 0

        averages = {
            'averageDownloadSpeed': total_speed / count,
            'averageLatency': total_latency / count,
            'averagePacketLoss': (total_loss / count) * 100
        }

        return jsonify(averages)

# Route to get the top 5 most appearing ISPs
@app.route('/api/ndt-results/top-isps', methods=['GET'])
def get_top_isps():
    with Session(db.engine) as session:
        top_isps = session.query(
            NdtResult.ASName,
            func.count(NdtResult.ASName).label('count')
        ).group_by(NdtResult.ASName).order_by(desc('count')).limit(5).all()

        output = [{'isp': isp.ASName, 'count': isp.count} for isp in top_isps]

        return jsonify({'top_isps': output})
    
# Route to get the top 5 most appearing places
@app.route('/api/ndt-results/top-places', methods=['GET'])
def get_top_places():
    with Session(db.engine) as session:
        top_places = session.query(
            NdtResult.City,
            func.count(NdtResult.City).label('count')
        ).group_by(NdtResult.City).order_by(desc('count')).limit(5).all()

        output = [{'place': place.City, 'count': place.count} for place in top_places]

        return jsonify({'top_places': output})

# Route to get the coordinates (latitude and longitude) for a place
@app.route('/api/coordinates', methods=['GET'])
def get_coordinates_by_place():
    place = request.args.get('place')
    
    if not place:
        return jsonify({'message': 'Place is required'}), 400
    
    with Session(db.engine) as session:
        coordinates = session.query(NdtResult.Latitude, NdtResult.Longitude).filter(
            NdtResult.City == place
        ).first()  # Get the first matching result

        if coordinates:
            return jsonify({
                'lat': coordinates.Latitude,
                'long': coordinates.Longitude
            })
        else:
            return jsonify({'message': 'Coordinates not found for the selected place'}), 404
        
@app.route('/api/check-update', methods=['GET'])
def check_update():
    last_check_time = request.args.get('last_check_time')

    if not last_check_time:
        return jsonify({'message': 'Last check time is required'}), 400

    try:
        last_check_time = datetime.strptime(last_check_time, '%Y-%m-%dT%H:%M:%S')
    except ValueError:
        return jsonify({'message': 'Invalid date format'}), 400

    with Session(db.engine) as session:
        latest_record = session.query(func.max(NdtResult.date)).scalar()

        if latest_record and latest_record > last_check_time:
            return jsonify({'updated': True})
        else:
            return jsonify({'updated': False})




if __name__ == '__main__':
    app.run(debug=True)
