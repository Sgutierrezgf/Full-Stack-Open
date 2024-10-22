/* eslint-disable react/prop-types */
const Header = ({ course }) => {
    return (
        <>
            <h1>{course.name}</h1>
        </>
    );
};

const Content = ({ course }) => {
    return (
        <div>
            {
                course.parts.map(part =>
                    <p key={part.id}>{part.name} {part.exercises}</p>
                )
            }
        </div>
    )
}

const Total = ({ course }) => {
    const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
        <>
            <h1>total of {totalExercises} exercises</h1>
        </>
    );
};

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    )
}

export default Course
