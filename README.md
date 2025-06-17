# Recipe and Order Price Analytics System

A full-stack web application for analyzing recipe costs and order pricing data with interactive charts and dynamic filtering.

## Features

- **Interactive Analytics Dashboard**: View order quantity and price trends over time
- **Dynamic Category Filtering**: Select categories to filter relevant ingredients
- **Multi-select Ingredient Analysis**: Compare multiple ingredients simultaneously
- **Real-time Data**: Connected to MongoDB for live data updates
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Chart.js** - Interactive data visualization
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Flask** - Python web framework
- **MongoDB** - NoSQL database
- **PyMongo** - MongoDB driver for Python
- **Flask-CORS** - Cross-origin resource sharing

## Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   └── orderPriceGraph.jsx
│   │   ├── pages/           # Page components
│   │   └── App.jsx          # Main app component
│   └── package.json
├── backend/                  # Flask backend application
│   ├── app.py               # Flask app configuration
│   ├── routes.py            # API routes
│   ├── run.py               # Server startup script
│   └── requirements.txt     # Python dependencies
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- MongoDB database

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Create environment file**:
   Create a `.env` file in the backend directory with your MongoDB URI:
   ```
   URI=your_mongodb_connection_string
   ```

4. **Start the backend server**:
   ```bash
   python run.py
   ```
   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   The application will open on `http://localhost:3000`

## Usage

1. **Access the application** at `http://localhost:3000`
2. **Navigate to the Test Graph page** to view the analytics dashboard
3. **Select a category** from the dropdown (e.g., "Liquid Ingredients")
4. **Choose ingredients** from the filtered list (hold Ctrl/Cmd for multiple selections)
5. **Toggle between Quantity and Price** views using the radio buttons
6. **View the interactive chart** showing trends over time

## API Endpoints

### Backend API (Port 5000)

- `GET /api/categories` - Get all available categories
- `POST /api/ingredients-by-category` - Get ingredients for a specific category
- `GET /api/ingredient-types` - Get all ingredient types
- `POST /orderprice/query` - Query order price data
- `GET /health` - Health check endpoint

## Database Schema

The application connects to a MongoDB database with the following collections:

- **order-price**: Contains order pricing data with categories and ingredients
- **recipes**: Recipe information
- **inventory**: Inventory management data
- **ingredients**: Ingredient details

## Development

### Running in Development Mode

Both frontend and backend support hot reloading for development:

- **Frontend**: Automatically reloads on file changes
- **Backend**: Debug mode enabled with auto-reload

### Testing

- **Frontend**: `npm test` (Jest with React Testing Library)
- **Backend**: Manual testing via API endpoints

## Deployment

### Production Considerations

1. **Environment Variables**: Set production MongoDB URI
2. **CORS Configuration**: Update allowed origins for production domain
3. **Static Files**: Build frontend with `npm run build`
4. **WSGI Server**: Use production WSGI server (e.g., Gunicorn)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 