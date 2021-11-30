import { MockedProvider } from "@apollo/client/testing";
import { RenderResult } from "@testing-library/react";
import { render } from "../../../test-utils";

describe("<RestaurantScreen />", ()=>{
    let renderResult:RenderResult;
    beforeEach(()=>{
        renderResult=render(
            <MockedProvider mocks={[
                {
                    request:{
                        query:RESTAURANT_QEURY
                    }
                }
            ]}>

            </MockedProvider>
        )
    }
})