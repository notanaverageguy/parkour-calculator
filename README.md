# Parkour Calculator

A web-based calculator for parkour game mechanics, helping players calculate XP, points, level progression, and combo scores.

## Features

- **Level Range Calculator**: Calculate XP and points required to progress between levels
- **Points to Level Converter**: Convert points to levels and XP
- **Time Estimator**: Estimate time needed to reach target levels based on points per minute
- **Points to XP Calculator**: Calculate XP gained from points and XP per point ratio
- **Combo Score Calculator**: Calculate combo scores based on:
  - Total combos
  - Longest combo duration
  - Highest combo count
  - Combo breaks
- **Interactive Graph**: Visualize the relationship between points and XP

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/parkour-calculator.git
cd parkour-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Branch**: Make your changes in a new branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes**: Implement your changes or fixes
4. **Test**: Ensure all calculations work correctly
5. **Commit**: Commit your changes with a clear message
   ```bash
   git commit -m "Add feature: your feature description"
   ```
6. **Push**: Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Pull Request**: Create a pull request from your fork to the main repository

### Development Guidelines

- Follow the existing code style
- Add comments for complex calculations
- Update documentation when adding new features
- Test your changes thoroughly
- Keep commits focused and atomic

### Project Structure

```
parkour-calculator/
├── src/
│   ├── styles/         # CSS and styling files
│   ├── main.js         # Main application logic
│   └── main.html       # HTML structure
├── package.json        # Project dependencies
└── README.md          # Project documentation
```

## License

This project is licensed under the GNU General Public License License - see the LICENSE file for details.

## Acknowledgments

- Desmos Graphing Calculator for the interactive graph functionality
- Tailwind CSS for styling
