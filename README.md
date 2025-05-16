# Problem Statement

## 1. Main Functionality
The application’s main functionality is to enable users to:

- Evaluate important aspects of their life using the Wheel of Life
- Receive AI-generated suggestions and personalized feedback for improvement
- Track their evaluations over time and visualize trends
- Write reflective notes and input category ratings

AI will analyze both current and past data to provide actionable, mostly positive feedback and tailored suggestions.

![Wheel of Life](/docs/WheelOfLife.png)

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

   
# Initial System Structure

The system will be divided into the following technical components:

- **Server**
   - Implemented using **Spring Boot** as a **RESTful API** backend to handle authentication, category and reflection management, report generation, and communication with the GenAI service.

- **Client**
   - Built using **React** with **Vite** for fast development and bundling.
   - Styled using **Tailwind CSS**.
   - UI components will be provided by **shadcn/ui** for a modern and accessible interface.

- **GenAI Service**
   - A separate microservice written in **Python**, utilizing **LangChain** to provide personalized AI feedback and empathetic conversational interactions.

- **Database**
   - **PostgreSQL** will be used for persistent storage of user accounts, categories, reflections, and generated reports.

- **Containerization**
   - All components will be containerized using **Docker** to ensure consistency across development, testing, and deployment environments.


# Diagrams

![Use Case Diagram](/docs/UseCaseDiagram.png)
Use Case Diagram

A user logs into their account and fills out a weekly reflection. This includes rating their selected life categories (on a scale from 1 to 10) and optionally adding a note about their week. Once they submit the reflection, they receive personalized feedback based on what they wrote and past reflections if available.

The user can also start a chat with an assistant to get further support or guidance. The assistant uses current and previous reflections to provide relevant and meaningful replies.

In addition, users can manage their life categories, adding new ones or removing the ones that no longer apply. They can also view their progress over time through reports and charts, helping them understand trends in different areas of their life.



![Component Diagram](/docs/ComponentDiagram.png)
Component Diagram

The system consists of four main parts: the server, the client, the GenAI service, and the database.
The server contains an authentication service that is used by the user repository and the LoginUI to handle user authentication and access control. 
It also includes a progress service, which manages past reflections and is used by the reflection repository and the ProgressUI. 
The reflection service handles creating and updating weekly reflections and is used by the reflection repository, the ReflectionUI, and the ReportUI. 
The GenAI service includes an AI feedback service, which is used by the AI feedback repository, the ReportUI, and the AIChatUI to provide personalized feedback. 
It also includes an AI chat service that is used by the AIChatUI to support interactive conversations. 
The client consists of all user interfaces including LoginUI, ReflectionUI, ProgressUI, ReportUI, and AIChatUI, which interact with both the server and the GenAI service. 
The database stores all application data including users, reflections, categories, and feedback, and is accessed through the user repository, reflection repository, and AI feedback repository.


![Analysis Object Model](/docs/AnalysisObjectModel.png)
Analysis Object Model
Each user has their own set of life categories, which they can customize to match what's important to them. They use these categories to rate their week during the reflection process.

The reflection includes those ratings and an optional note. Each reflection is tied to the user and stored in the system.

After a reflection is submitted, a feedback report is created using the GenAI service. This report is based on both the current reflection and past data, if there is any.

Users also have a dashboard that shows progress over time. This is generated by looking at past reflections and displaying charts or stats.

Categories are grouped under main types like Career, Health, Relationships, and Other. Users can create or remove subcategories to personalize their experience.