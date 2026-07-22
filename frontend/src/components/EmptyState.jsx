function EmptyState({ message = "No Blogs Found" }) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-500">
                {message}
            </h2>
        </div>
    );
}

export default EmptyState;