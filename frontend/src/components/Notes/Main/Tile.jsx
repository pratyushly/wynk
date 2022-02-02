function Tile(props) {

    let titleDisplayLength = 15;

    let titleDisplay = props.note.title.substring(0, titleDisplayLength);
    titleDisplay += props.note.title.length > titleDisplayLength ? "..." : "";

    return (
        <>
            <div className="flex">
                <button className="py-1 flex-1 text-left focus:outline-none group" onClick={() => { props.onClick(props.note.id) }}>
                    📄 <span className="group-focus:underline">{titleDisplay}  </span>
                </button>
                <button className="hover:bg-hover px-3 py-1 rounded-sm select-none focus:outline-none focus:bg-hover" onClick={() => { props.onDelete(props.note.id) }}>Delete</button>
            </div>
        </>
    );
}

export default Tile;