# Problem Statement

## 1. Main Functionality
The application’s main functionality is to enable users to:

- Evaluate important aspects of their life using the Wheel of Life
- Receive AI-generated suggestions and personalized feedback for improvement
- Track their evaluations over time and visualize trends
- Write reflective notes and input category ratings

AI will analyze both current and past data to provide actionable, mostly positive feedback and tailored suggestions.

![Wheel of Life](/images/WheelOfLife.png)

---

## 2. Wheel of Life Categories

1. **Career**
2. **Finances**
3. **Growth**
4. **Purpose**
5. **Health**
    - Mental
    - Physical
6. **Relationships**
    - Family
    - Friends
    - Romance
7. **Other**
    - Spirituality
    - Personal Development
    - Entertainment
8. **Custom Categories**
    - Users can add (e.g., Social Engagement) or remove categories as they wish.

---

## 3. Intended Users
Individuals interested in personal development, emotional wellness, and self-reflection, including:

- Students
- Professionals
- Anyone aiming to improve and balance their life

---

## 4. GenAI Integration
- **Analysis**: AI processes weekly and historical ratings plus reflective notes.
- **Feedback**: Provides mostly positive, data-driven feedback.
- **Suggestions**: Offers small, actionable steps tailored to the user’s current state and trends.
- **Privacy**: Acts as a private coach, lowering the barrier to sharing personal reflections.

---

## 5. Example User Scenario

1. **Login & Review**
    - User signs in via OAuth.
    - Views previous weeks’ Wheel of Life reports.

2. **Weekly Report**
    - Rates satisfaction in each category.
    - Adds a short reflective note, e.g.:
      > “Feeling a bit lonely, haven’t seen my friends for two weeks and feel a little overworked.”

3. **AI-Generated Feedback**
   > “Based on your report, you’ve been feeling a bit lonely and mentioned feeling a little overworked.  
   > Similar to previous weeks, your finances are stable, which is a great foundation and something you can feel proud of — it shows you’ve been handling your responsibilities well.
   >
   > Here are a few small, positive steps you might try this week:
   > - 💬 Send a short message to a friend you haven’t talked to in a while, just to check in and see how they’re doing.
   > - 🤝 Try to meet up with a friend this weekend, or look for an interesting event or even visit a local park to meet new people.
   > - 🏃‍♂️ Add light exercise like a daily walk or some stretching — it’s great for boosting both mood and energy.
   > - 💤 Take short breaks during your workday to help recharge and ease the sense of being overworked.
   >
   > You’re already making progress, and these small steps can help things feel even better. Would you like more suggestions or have any other questions?”

4. **Ongoing Reflection**
    - User chats with the AI for further guidance.
    - Over time, reviews trend visualizations to see improvements.

---
## Initial Product Backlog

- **User Authentication**
   - As a user, I want to log in and log out of my account, so I can have access to stored data.

- **Life Category Management**
   - As a user, I want to add new and remove existing life categories, so my wheel of life reflects what truly matters in my life.

- **Weekly Reflection Logging**
   - As a user, I want to create weekly reflections by rating my life categories from 1-10 and adding a reflective note, so I can reflect and have visual evaluation of my week in a structured and visual way.

- **Personalized AI Feedback**
   - As a user, I want to receive improvement or encouragement as personalized AI feedback report, so I can have a more balanced fulfilling life.

- **AI Assistant Interaction**
   - As a user, I want to choose to interact with an AI assistant, so I can unleash the emotions that I am reluctant to share with other people and get helpful, empathic guidance.

- **Progress Visualization**
   - As a user, I want to view past weekly reports in visual charts, so I can track my emotional and personal progress over time.

# Diagrams

![Use Case Diagram](/images/UseCaseDiagram.png)
Use Case Diagram


![Component Diagram](/images/UseCaseDiagram.png)
Component Diagram


![Analysis Object Model](/images/AnalysisObjectModel.png)
Analysis Object Model