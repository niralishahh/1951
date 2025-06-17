# Testing Guide for OrderPriceGraph Component

## 1. Automated Testing (Jest)

### Run Component Tests
```bash
cd frontend
npm test orderPriceGraph.test.jsx
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

## 2. Manual Testing

### Start the Frontend
```bash
cd frontend
npm start
```

### Start the Backend (with test routes)
```bash
cd backend
python run.py
```

### Access Test Page
Navigate to: `http://localhost:3000/test-graph`

## 3. Backend Testing

### Test Backend Endpoints
```bash
# Test health check
curl http://localhost:5000/test/health

# Test categories endpoint
curl http://localhost:5000/api/categories

# Test ingredient types endpoint
curl http://localhost:5000/api/ingredient-types

# Test order price query
curl -X POST http://localhost:5000/orderprice/query \
  -H "Content-Type: application/json" \
  -d '{"category": "proteins", "ingredient_types": ["chicken", "beef"]}'
```

## 4. Browser Testing

### Open Developer Tools
1. Press `F12` in your browser
2. Go to **Network** tab
3. Go to **Console** tab for error messages

### Test Scenarios
1. **Load the page** - Check if categories and ingredients load
2. **Select a category** - Verify dropdown works
3. **Select ingredient types** - Test checkboxes and Select All/Clear All
4. **Switch Y-axis** - Test Quantity vs Price radio buttons
5. **View chart** - Check if chart renders with data
6. **Test error handling** - Disconnect backend and see error messages

## 5. Integration Testing

### Test Complete Flow
1. Start both frontend and backend
2. Navigate to test page
3. Select "proteins" category
4. Select "chicken" and "beef"
5. Switch between Quantity and Price views
6. Verify chart updates correctly

## 6. Performance Testing

### Check Bundle Size
```bash
cd frontend
npm run build
```

### Check Network Requests
- Open Network tab in DevTools
- Look for API calls to `/api/categories`, `/api/ingredient-types`, `/orderprice/query`
- Verify response times and data sizes

## 7. Accessibility Testing

### Keyboard Navigation
- Tab through all form controls
- Use Enter/Space to activate buttons
- Verify focus indicators are visible

### Screen Reader Testing
- Use screen reader to navigate the component
- Verify all labels and descriptions are announced

## 8. Mobile Testing

### Responsive Design
- Test on different screen sizes
- Verify controls are usable on mobile
- Check chart responsiveness

## 9. Error Scenarios

### Test Error Handling
1. **Network errors** - Disconnect internet
2. **Invalid data** - Send malformed requests
3. **Empty responses** - Test with no data
4. **Slow responses** - Test loading states

## 10. Data Validation

### Test Data Processing
- Verify dates are sorted correctly
- Check quantity vs price calculations
- Test with different data ranges
- Verify chart colors and legends

## Troubleshooting

### Common Issues
1. **Chart not rendering** - Check if Chart.js is properly imported
2. **API calls failing** - Verify backend is running and CORS is configured
3. **Styling issues** - Check if Tailwind CSS is loaded
4. **Test failures** - Run `npm install` to ensure all dependencies are installed

### Debug Commands
```bash
# Check frontend dependencies
npm list

# Check backend dependencies
pip list

# Clear npm cache
npm cache clean --force

# Reset node_modules
rm -rf node_modules && npm install
``` 