import {AiFillCloseCircle} from "react-icons/ai";

const PopUp = ({ children, className, close, centered = false }) => {

    return (
        <div className={`c-pop_up ${className} ${centered ? 'c-pop_up--centered' : ''}`}>
            {
                close ?
                    <AiFillCloseCircle
                        className="c-pop_up__close"
                        size={"1.6em"}
                        onClick={() => close(false)}
                    />
                :
                    ''
            }
            {children}
        </div>
    )
}

export default PopUp